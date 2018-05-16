(function() {

  ACXM.Base = {
    initTooltips: initTooltips
  };

// ---------------------------------------------	
//  Tooltip positioning	

// ---------------------------------------------
  function initTooltips() {
    $(".acxiom-tooltip").each(function() {
      $(this).css("margin-top", -($(this).outerHeight(true) + 36));
    });
  }

  $(function() {
     $(document).on("click", ".acxm-disabled", function(e) {
       e.preventDefault();
       e.stopPropagation();
     });
  });

})();
