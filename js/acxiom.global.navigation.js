(function() {

  ACXM.GlobalNav = {
    init: function() {
      var globalNavRoot = $(".acxiom-global-navigation");

      var globalmenuState = false;
      var notificationTray = false;

      //company dropdown list
      $('.main-list li a', globalNavRoot).click(function() {
        $('.main-list .active').removeClass("active");
        $(this).parent().addClass("active");
        $('.current-selection').text($('.main-list .active a').text());
      });

      // small icons/logos
      $('.acxiom-div-logo-small', globalNavRoot).click(function() {
        if (notificationTray) {
          $('.acxiom-notifications-tray').slideUp("slow", function() {
            notificationTray = false;
          });
        }

        if (globalmenuState) {
          $('.acxiom-global-menu').slideUp("slow", function() {
            globalmenuState = false;
          });
        } else {
          $('.acxiom-global-menu').slideDown("slow", function() {
            globalmenuState = true;
          });
        }
      });

      // tray arrow/close button
      $('.tray-close-button', globalNavRoot).click(function() {
        $('.acxiom-global-menu').slideUp("slow", function() {
          globalmenuState = false;
        });
      });

      // acxiom nots
      $('.acxiom-nots', globalNavRoot).click(function() {

        if (globalmenuState) {
          $('.acxiom-global-menu').slideUp("slow", function() {
            globalmenuState = false;
          });
        }

        if (notificationTray) {
          notificationTray = false;
          $('.acxiom-notifications-tray').slideUp("slow");
          $(".acxiom-nots").removeClass("active");
        } else {
          notificationTray = true;
          $('.acxiom-notifications-tray').slideDown("slow");
          $(".acxiom-nots").addClass("active");
        }
      });

      // company name under large icons/logos
      function toggleTitle(title, show) {
        var companyTitle = $(".acxm-company-title", globalNavRoot);

        if (!show) {
          companyTitle.css("display", "none");
          return;
        }
        companyTitle.html(title);
        companyTitle.css("display", "block");

        var titleLeft = (($(this).offset().left + 39 / 2)) - (companyTitle.width() / 2) + ($(this).hasClass("active") ? 3 : 0);
        titleLeft = titleLeft < 15 ? 15 : titleLeft;

        companyTitle.css("left", titleLeft);
      }

      // large icons/logos
      $(".acxiom-div-logo-large a img", globalNavRoot).click(function() {
        $(".acxiom-div-logo-large a .active").removeClass("active");
        $(this).addClass("active");
        toggleTitle.call(this, $(this).attr("data-title"), 1);
      }).mouseover(function() {
            toggleTitle.call($(this), $(this).attr("data-title"), 1);
          }).mouseout(function() {
            toggleTitle.call($(this), "", 0);
          });

      $(document).click(function(e) {
        if (globalmenuState && !$(e.target).parents(".acxiom-global-navigation").length) {
          $('.acxiom-global-menu').slideUp("slow", function() {
            globalmenuState = false;
          });
        }
      });

    }
  };

})();
