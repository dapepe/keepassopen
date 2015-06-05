var fs = require('fs'),
    gui = require('nw.gui'),
    crypto = require('crypto');

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
            gui.Window.get().showDevTools;
            view = new ViewMain();
            gui.Window.get().on('close', function() {
                gui.App.quit();
            });
            break;
    }

    $(document.body).adopt(view.gui);
});