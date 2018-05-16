(function() {

  ACXM.GlobalNav = {

    init: function(options) {

      function init(dom) {
        var data = ACXM.GlobalNav.Data;

        // L0
        var l0 = dom.find("#acxm-glbal-nav-l0");
        l0.find(".s-logo a").attr("href", data.AcxiomCorporateUrl);
        l0.find(".s-logo img").attr("src", ACXM.GlobalNav.Data.StyleGuideRoot + "/styles/img/logo.png");

        (function() {
          // application-name

          if (data.LevelZeroItems) {
            var applicationEl = dom.find(".s-application-name ul");
            $.each(data.LevelZeroItems, function(key, value) {
              var el = $("<li><a><span class='label'></span></a></li>");

              var a = el.find("a").attr({
                href: value.Link.URL
              });

              var label = el.find(".label").text(value.Link.Name);

              if (!value.IsAccessible) {
                a.addClass("acxm-disabled");

                if (data.FreemiumUpgradeUrl && data.LoggedUser.WorkingCompanyIsFreemium) {
                  var info = $("<span class='info'></span>");

                  info.click(function() {
                    var dialog = new ACXM.GlobalNav.Dialog({
                      placeholder: el,
                      content: upgradeText
                    });

                    dialog.show();
                  });

                  el.append(info);
                }

              }

              if (data.SelectedLevelZeroItem.Id === value.Link.Id) {
                el.addClass("active");
              }

              applicationEl.append(el);
            });

            // application market place
            var el = dom.find(".application-marketplace").clone();
            el.find("a").attr("href", data.ApplicationMarketplaceUrl);
            dom.find(".application-marketplace").remove();

            applicationEl.append(el);

            // application select item
            dom.find(".s-application-name > label").text(data.SelectedLevelZeroItem.DisplayName);
          } else {
            dom.find(".s-application-name").addClass("hidden");
          }

        })();

        (function() {
          if (data.IsTenant) {
            // s-tenant
            var tenantEl = dom.find(".s-tenant ul");

            $.each(data.LoggedUser.Companies, function(key, value) {
              var el = $("<li><a><span class='label'></span></a></li>");

              el.find(".label").text(value.DisplayName);
              el.find("a").attr("href", value.Url);

              if (data.LoggedUser.WorkingCompanyId === value.Id) {
                el.addClass("active");
              }

              tenantEl.append(el);
            });

            dom.find(".s-tenant > label").text(data.LoggedUser.WorkingCompanyName);
          } else {
            dom.find(".s-tenant").addClass("hidden");
          }
        })();

        // user-name
        (function() {
          if (data.LoggedUser) {
            var userNameEl = dom.find(".s-user-name");

            var help = userNameEl.find("[data-id=help]");
            if (!data.IsHelp) {
              help.remove();
            } else {
              help.click(function() {
                if (GlobalNav.events.isListened("helpClick")) {
                  return GlobalNav.events.dispatchEvent("helpClick");
                } else {
                  ACXM.Dialog.show({
                    "id": "helpIngoBox",
                    "type": "confirm",
                    "title": "Help",
                    "message": "Help file is currently unavailable, please contact support",
                    "buttons": {
                      "OK": {
                        "class": "primary"
                      }
                    }
                  });

                  return false;
                }
              });
            }

            userNameEl.find("> label").text(data.LoggedUser.Name);

            userNameEl.find("[data-id=tech-support] a").attr("href", data.TechSupportUrl);
            userNameEl.find("[data-id=settings] a").attr("href", data.AccountCenterUrl);
            userNameEl.find("[data-id=signout] a").attr("href", data.LogOutUrl);
          } else {
            dom.find(".s-user-name").addClass("hidden");

            if (data.LevelOneItems && data.LevelOneItems[0].Name === "login") {
            } else {
              dom.find(".s-signin").removeClass("hidden").find("a").attr("href", data.LogInUrl);
            }
          }
        })();

        // L1
        var l1 = dom.find("#acxm-glbal-nav-l1");

        // feature-bar
        (function() {
          if (data.LevelOneItems && data.LevelOneItems.length > 1) {
            var featureBarEl = l1.find(".s-feature-bar ul");

            $.each(data.LevelOneItems, function(key, value) {
              var el = $("<li><a><span class='label'></span></a></li>");

              el.find(".label").text(value.DisplayName);
              el.find("a").attr("href", value.URL);

              if (data.SelectedLevelOneItem.Id === value.Id) {
                el.addClass("active");
              }

              featureBarEl.append(el);
            });
          }
        })();

        if (data.FreemiumUpgradeUrl && data.LoggedUser.WorkingCompanyIsFreemium) {
          upgradeText.find("a").attr("href", data.FreemiumUpgradeUrl);

          l1.find(".s-placeholder-right [data-id=upgrade] a").click(function(e) {
            e.preventDefault();

            var dialog = new ACXM.GlobalNav.Dialog({
              placeholder: l1.find(".s-placeholder-right [data-id=upgrade]"),
              content: upgradeText
            });

            dialog.show();
          });
        } else {
          l1.find(".s-placeholder-right [data-id=upgrade]").addClass("hidden");
        }

        dom.find(".s-collapse").click(function() {
          var el = $("#acxm-global-nav");

          var calc = ($(".s-application-name").width() + 30) + "px";

          $(".s-placeholder-left").css({
            width: el.hasClass("collapsed") ? "184px" : calc
          });

          $(".s-application-name").css({
            width: el.hasClass("collapsed") ? "auto" : calc
          });

          el.toggleClass("collapsed");
        });

        globalNav.append(dom.contents());

        $(document).on("mouseleave", ".acxm-dd-menu", function(e) {
          $(this).find(".acxm-global-nav-dialog").addClass("hidden");
        });

        $(document).on("click", ".acxm-dd-menu a, .s-feature-bar a", function(e) {
          $(this).parents("ul").find(".active").removeClass("active");
          $(this).parents("li").addClass("active");

          return GlobalNav.events.dispatchEvent("navClick", {
            url: $(this).attr("href"),
            nav: new NavObject(data.SelectedLevelZeroItem.Name, data.SelectedLevelZeroItem.IconURL, $(this).text())
          });
        });

        GlobalNav.nav = new NavObject(data.SelectedLevelZeroItem.Name, data.SelectedLevelZeroItem.IconURL, data.SelectedLevelOneItem.Name);
        GlobalNav.helpItems = data.HelpItems;
        GlobalNav.events.dispatchEvent("ready");
      }

      $.ajax({
        url: ACXM.GlobalNav.Data.StyleGuideRoot + "/templates/acxiom.globalnav.html"
      }).done(function(data) {
            init($(data))
          });

      var globalNav = $("#acxm-global-nav");
    },

    Dialog: function(params) {
      params.content.find(".close").click(function(e) {
        e.preventDefault();

        params.content.addClass("hidden");
      });

      params.content.addClass("acxm-global-nav-dialog hidden");
      params.placeholder.append(params.content);

      this.show = function() {
        params.content.removeClass("hidden");
      };

      this.hide = function() {
        params.content.addClass("hidden");
      };
    }

  };

  var upgradeText = $("<div class='acxm-global-nav-dialog'>You are using Freemium Plan. <a href=''>Upgrade</a> to activate more applications and features<button class='close'/></div>");

})();
