var ViewMain = new Class({
    Implements: Events,
    settingsWindow: null,

    initialize: function() {
        console.log('test2');
        this.gui = __({'tag': 'form', 'class': 'rbox', 'children': {
            'logo': {'class': 'a-c ptop-10 pbottom-20', 'child': {'tag': 'img', 'alt': 'KeePass Open', 'src': './assets/logo.png'}},
            'username': {'class': 'form-group', 'children': {
                'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-user"></span> Username'},
                'input': {'tag': 'input', 'type': 'text', 'class': 'form-control', 'placeholder': 'username@platform', 'value': 'admin@pepe'}
            }},
            'password': {'class': 'form-group', 'children': {
                'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-lock"></span> Password'},
                'input': {'tag': 'input', 'type': 'password', 'class': 'form-control', 'placeholder': 'Password'}
            }},
            'footer': {'class': 'ptop-10', 'children': {
                'settings': {'tag': 'button', 'type': 'button', 'class': 'left btn btn-primary', 'html': '<span class="indicator glyphicon glyphicon-wrench"></span> Settings'},
                'submit': {'tag': 'button', 'type': 'submit', 'class': 'right btn btn-success', 'html': '<span class="indicator glyphicon glyphicon-ok-circle"></span> Login'},
                'clear': {'class': 'clear'}
            }}
        }});

        this.gui._footer._settings.addEvent('click', function() {
            this.openSettings();
        }.bind(this));

        this.addEvent('reset', function() {
            this.gui._password._input.erase('value');
            this.gui._username._input.focus();
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
    },

    openSettings: function() {
        if (this.settingsWindow != null) {
            this.settingsWindow.focus();
            return;
        }

        this.settingsWindow = gui.Window.open('index.html#settings', {
            title: 'Settings',
            toolbar: true,
            position: 'center',
            resizable: true,
            resizable: true,
            width: 600,
            height: 700
        });
        this.settingsWindow.on('close', function() {
            this.settingsWindow = null;
        }.bind(this));
    },

    openFile: function() {
        child = exec('"C:\\Program Files (x86)\\KeePass Password Safe 2\\KeePass.exe" "Z:\\cloud\\Zeyon\\Datacenter\\zfx.kdbx" -pw:zfx123',
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            }
        );

        return;

        var userid = this.gui._username._input.get('value');
        var password = this.gui._password._input.get('value');

        if (userid === '' || password === '')
            throw('Username and password must be specified!');

        alert(userid);
    }
});