var fs = require('fs'),
    gui = require('nw.gui'),
    crypt = require('crypto'),
    child_process = require('child_process');

var AppClass = new Class({
    Implements: Events
});

window.addEvent('appready', function() {
    var view;

    // localStorage
    // Dispatch the anchor
    var myURI = new URI();
    var anchor = myURI.get('fragment');
    switch (anchor) {
        case 'settings':
            view = new ViewSettings();
            global.ViewSettings = view;
            break;
        default:
            view = new ViewMain();
            global.ViewMain = view;
            gui.Window.get().on('close', function() {
                gui.App.quit();
            });
            break;
    }

    $(document.body).adopt(view.gui);
});