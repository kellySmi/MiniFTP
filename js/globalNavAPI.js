function NavObject(levelZeroName, iconUrl, levelOneName) {
    this.level0 = {
        name: levelZeroName || "",
        iconurl: iconUrl || "#"
    };

    this.level1 = {
        name: levelOneName || ""
    };
}

GlobalNav = {
    nav: new NavObject(),
    setAutoCompleteList: function (list) {},
    events: (function () {
        var returnObject = {};

        function getContainer() {
            return document.getElementsByTagName('html')[0];
        }

        return {
            addListener: function (evType, func, returnObj) {
                jQuery(getContainer()).bind(evType, func);
                returnObject[evType] = returnObj;
            },
            dispatchEvent: function (evType, optParams) {
                var event = jQuery.Event(evType);
                event.detail = optParams;
                jQuery(getContainer()).trigger(event);

                return returnObject[evType];
            },
            isListened: function (evType) {
                return evType in returnObject;
            }
        };
    })(),

    OpenHelp: function (topicId) {
        var helpItem = null;
        for (var i in GlobalNav.helpItems) {
            if (GlobalNav.helpItems[i].id == topicId) {
                helpItem = GlobalNav.helpItems[i];
            }
        }

        if (helpItem && helpItem.helpLoc) {
            window.open(helpItem.helpLoc);
        }
    },
    
    HelpClick: function () {
        if (GlobalNav.events.isListened('helpClick')) {
            return GlobalNav.events.dispatchEvent('helpClick');
        } else {
            ACXM.Dialog.show({
                'id': 'helpIngoBox',
                'type': 'confirm',
                'title': 'Help',
                'message': 'Help file is currently unavailable, please contact support',
                'buttons': {
                    'OK': {
                        'class': 'primary'
                    }
                }
            });
            return false;
        }
    }
};