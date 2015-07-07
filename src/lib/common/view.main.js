var ViewMain = new Class({
    Implements: Events,
    settingsWindow: null,

    initialize: function() {
        this.gui = __({'tag': 'form', 'class': 'pad-10 logindialog', 'children': {
            'logo': {'class': 'ptop-10 pbottom-20 mleft-20', 'child': {'tag': 'img', 'alt': 'KeePass Open', 'src': './assets/logo.png'}},
            'form': {'class': 'loginform', 'children': {
                'settingsfile': {'class': 'form-group has-feedback', 'children': {
                    'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-play-circle"></span> Settings file'},
                    'input': {'tag': 'input', 'type': 'text', 'class': 'form-control', 'placeholder': 'Select file'},
                    'icon': {'tag': 'span', 'type': 'text', 'class': 'glyphicon glyphicon-warning-sign form-control-feedback', 'aria-hidden': 'true'}
                }},
                'password': {'class': 'form-group', 'children': {
                    'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-lock"></span> Password'},
                    'input': {'tag': 'input', 'type': 'password', 'class': 'form-control', 'placeholder': 'Password'}
                }}
            }},
            'footer': {'class': 'ptop-10', 'children': {
                'open': {'tag': 'button', 'type': 'button', 'class': 'left btn btn-primary', 'html': '<span class="indicator glyphicon glyphicon-wrench"></span> Edit settings'},
                'new': {'tag': 'button', 'type': 'button', 'class': 'left btn btn-default mleft-10', 'html': '<span class="indicator glyphicon glyphicon-plus"></span> New settings file'},
                'submit': {'tag': 'button', 'type': 'submit', 'class': 'right btn btn-success', 'html': '<span class="indicator glyphicon glyphicon-ok-circle"></span> Open'},
                'clear': {'class': 'clear'}
            }}
        }});

        // Edit an existing settings file
        this.gui._footer._open.addEvent('click', function() {
            var path = this.getJsonPath();
            if (path == null)
                return;

            var password = this.gui._form._password._input.get('value');

            if (global.ViewSettings.load(path, password)) {
                this.openSettings();
            } else {
                alert('Invalid password');
            }
        }.bind(this));

        // Add a new settings file
        this.gui._footer._new.addEvent('click', function() {
            global.ViewSettings.reset();
            this.openSettings();
            console.log('Add new');
        }.bind(this));

        this.addEvent('reset', function() {
            this.gui._form._password._input.erase('value');
            this.gui._form._password._input.focus();
        }.bind(this));
        this.gui.addEvent('submit', function(event) {
            event.preventDefault();
            this.openFile();
        }.bind(this));
        this.gui.addEvent('keypress', function(event) {
            if (event.key == 'enter') {
                event.preventDefault();
                this.openFile();
            }
        }.bind(this));

        this.jsonPicker = this.gui._form._settingsfile;
        this.jsonPicker._input.addEvent('click', function() {
            this.selectFile('.json', function(filename) {
                this.setJsonPath(filename);
            }.bind(this));
        }.bind(this));

        this.initSettingsWindow();

        if (localStorage.lastFile != null) {
            this.setJsonPath(localStorage.lastFile);
        }
    },

    setJsonPath: function(path) {
        if (path == null || !fs.existsSync(path)) {
            this.jsonPicker.addClass('has-warning');
            this.jsonPicker.removeClass('has-success');
            this.jsonPicker._input.erase('value');
            this.jsonPicker._icon.addClass('glyphicon-warning-sign');
            this.jsonPicker._icon.removeClass('glyphicon-ok');
            return;
        }

        this.jsonPicker.removeClass('has-warning');
        this.jsonPicker.addClass('has-success');
        this.jsonPicker._input.set('value', path);
        this.jsonPicker._icon.removeClass('glyphicon-warning-sign');
        this.jsonPicker._icon.addClass('glyphicon-ok');
    },

    getJsonPath: function() {
        var path = this.jsonPicker._input.get('value');

        if (fs.existsSync(path))
            return path;

        alert('No JSON file selected!');
        return null;
    },

    initSettingsWindow: function() {
        if (this.settingsWindow != null)
            return;

        this.settingsWindow = gui.Window.open('index.html#settings', {
            title: 'Settings',
            icon: 'assets/app.ico',
            toolbar: false,
            position: 'center',
            resizable: true,
            width: 600,
            height: 600,
            show: false
        });

        this.settingsWindow.on('close', function() {
            this.settingsWindow.hide();
            console.log("We're closing...");
            // this.settingsWindow = null;
        }.bind(this));
    },

    openSettings: function() {
        if (this.settingsWindow != null) {
            this.settingsWindow.show();
            this.settingsWindow.focus();
            return;
        }
    },

    selectFile: function (accept, callback, nwsaveas) {
        var filepicker = new Element('input', {'type': 'file', 'accept': accept, 'styles': {'display': 'none'}});

        if (nwsaveas != null)
            filepicker.set('nwsaveas', nwsaveas);

        this.gui.adopt(filepicker);
        filepicker.addEvent('change', function() {
            callback(this.value);
        });
        filepicker.click();
    },

    openFile: function() {
        var password = this.gui._form._password._input.get('value'),
            path = this.getJsonPath(),
            commandQueue = [];

        if (path == null || password === '')
            throw('Settings file and password must be specified!');

        var conf = new Config({
            'filename': path,
            'password': password
        });

        if (!conf.read()) {
            alert('Invalid password');
            return;
        }

        // Store the last file
        localStorage.lastFile = path;

        var timeout = conf.data.timeout;
        function processQueue() {
            if (conf.data.filelist.length == 0)
                process.exit(0); // Close the application

            var kdbx = conf.data.filelist.shift();

            var child = child_process.spawn(conf.data.exec, [kdbx.path, '-pw:' + kdbx.password], {
                detached: true
            });

            processQueue.delay(timeout);
            timeout = 200;
        }
        processQueue();
    }
});