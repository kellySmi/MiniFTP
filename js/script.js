'use strict';
var dns = require('dns'),
os = require('os'),
randomstring = require("random-string"),
ftpd = require('ftpd'),
fs = require('fs'),
pathLib = require('path'),
cpypst = require('copy-paste'),
slash = process.platform == 'win32' ? '\\' : '/',
defaultPath = pathLib.join(getUserHome(), 'Downloads'),
options = {
  pasvPortRangeStart: 4000,
  pasvPortRangeEnd: 5000,
  getInitialCwd: function(connection, callback) {
    var userPath = defaultPath;
    fs.exists(userPath, function(exists) {
      exists ? callback(null, userPath) : callback('path does not exist', userPath);
    });
  },
  getRoot: function(user) {
    return '';
  }
};

function browseSystem (name, server) {
	var chooser = $(name);
    chooser.change(function(evt) {
        //here is the absolute path chosen in the directory browser
        var dlPath = $(this).val();
        console.log(dlPath);
        // we need to assign this path to the ftp server config path
        // since that config is set before the user chooses the path, we need to either 
        // put the server creation in a function and call it or 
       // options.
        if(process.platform === 'win32'){
        	defaultPath = dlPath.substring(2,dlPath.length);
        } else {
        	defaultPath = dlPath;
        }
      
  	  $('#location').html(dlPath);
  	  $('#location').prop('title',dlPath);
    });    
}
function getNetworkAddresses(){
	var ifaces = os.networkInterfaces();
	var rtnAr = [];
	Object.keys(ifaces).forEach(function (ifname) {
	  var alias = 0
	    ;

	  ifaces[ifname].forEach(function (iface) {
	    if ('IPv4' !== iface.family || iface.internal !== false) {
	      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
	      return;
	    }
	    rtnAr.push(iface.address);
	  });
	});
	return rtnAr;
}
function getUserHome() {
	  return (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
}
function createProgressBar() {	
	$('#progressbar').progressbar({
		value: false,
		change: function() {
			$('#status').text("Download Progress: " + $('#progressbar').progressbar("value") + "%");
		}
	});
}
function destroyProgressBar() {
	$('#progressbar').remove();
	$('#statusSection').append('<div id="progressbar"></div>');
}
function progress(step) {
    var val = $('#progressbar').progressbar("value") || 0;
    $('#progressbar').progressbar("value", val + step);
}

$(function(){
	dns.lookup(os.hostname(), function (err, add, fam) {
		var host = add,
		prt = 4400,
		acctUsername = randomstring({
			length: 6,
			numeric: true,
			letters: true,
			special: false
		}),
		acctPassword = randomstring({
			length: 10,
			numeric: true,
			letters: true,
			special: false
		}),
		addresses = getNetworkAddresses();
		if(addresses.indexOf(host) == -1){
			host = addresses[0];
		}
		var server = new ftpd.FtpServer(host, options);
		server.on('client:connected', function(conn) {
			var username;
			console.log('Client connected from ' + conn.socket.remoteAddress);
			$('#status').html("Client Connected from " + conn.socket.remoteAddress);
			conn.on('command:user', function(user, success, failure) {
			username = user;
	        (user == acctUsername) ? success() : failure();
	      });
	      conn.on('command:pass', function(pass, success, failure) {
	        (pass == acctPassword) ? success(username) : failure();
	      });
	      conn.on('file:stor', function(response, data) {
	    	  
	    	  var file = data.file.split(slash);
    		  file = file[file.length-1];
	    	  
	    	  if(response == "open") {
	    		  $('#status').html('Incoming file: ' + file);
	    	  } else if(response == "close") {
	    		  
	    		  var date = new Date(data.duration);
	    		  var m = date.getMinutes();
	    		  var s = date.getSeconds();
	    		  
	    		  $('#dialog-confirm').show();

	    		  $('#fileNameField').html(file);
	    		  $('#fileSizeField').html(data.filesize + ' bytes');
	    		  $('#durationField').html(m + ' minutes, ' + s + ' seconds');	    		  
	    		  
	    		  $('#dialog-confirm').dialog({
	    		      resizable: false,
	    		      height: 170,
	    		      modal: true,
	    		      buttons: {
	    		        "OK": function() {
	    		        	$(this).dialog("close");
	    		        	$('#dialog-confirm').hide();
	    		        	window.close();
	    		        },
	    		      }
	    		  });
	    		  
	    		  $('#status').html("Client Connected from " + conn.socket.remoteAddress);
	    	  }
	      });
	    });
		
		server.on('error', function(error) {
			$('#status').html('<div class="errorStatus">FTP Server Error: <span title="' + error + '">' + error.substring(0,50) + '...' + '</span></div><br><input type="button" id="resetBtn" class="acxiom-button secondary" value="Reset">');
			$('#resetBtn').one('click', function() {
				server.listen(prt);
				$('#status').html('FTP server listening on port '+prt);
			});
		});
		$('#location').html(defaultPath);
		console.log(server.options);
		server.listen(prt);
		$('#status').html('FTP server listening on port '+prt);
		$('#srvrAdd').html("ftp://"+host+":"+prt);
		$('#uname').html(acctUsername);
		$('#pass').html(acctPassword);
		$('.copy').on('click',function(e){
			var type = $(e.target).attr('data-id');
			cpypst.copy(eval(type));
		});
		$('#browseButton').click(function(){
			$('#browser').trigger('click');
		})
		browseSystem('#browser', server);
		
	});
	
});