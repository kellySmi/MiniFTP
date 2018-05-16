(function() {

  ACXM.Nav = {
    init: function() {
      var isSubMenu = !!$(".acxiom-subtabs-container").length;

      $(".acxiom-topnav-tabs div").on('click', function() {
        $(".acxiom-topnav-tabs .active").removeClass("active");
        $(this).addClass("active");

        if (isSubMenu) {
          var subnavItemID = $(this).attr("data-tab-id");
          $(".acxiom-subtabs-container .active").removeClass("active");
          $(".acxiom-subtabs-container #" + subnavItemID).addClass("active");
        }
      });

      if (isSubMenu) {
        $(".acxiom-subnavSec-tabs-div ul li").on('click', function() {
          $(".acxiom-subnavSec-tabs-div .active").removeClass("active");
          $(this).addClass("active");
         });
      }
    }
  }

})();
