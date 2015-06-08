var fs = require('fs'),
    gui = require('nw.gui'),
    crypt = require('crypto'),
    exec = require('child_process').exec;

window.addEvent('appready', function() {
    var view;

    // localStorage
    // Dispatch the anchor
    var myURI = new URI();
    var anchor = myURI.get('fragment');
    switch (anchor) {
        case 'settings':
            view = new ViewSettings();
            break;
        default:
            view = new ViewMain();
            gui.Window.get().on('close', function() {
                gui.App.quit();
            });
            view.openSettings();
            break;
    }

    $(document.body).adopt(view.gui);
});