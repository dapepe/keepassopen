var ViewSettings = new Class({
    defaulTimeout: 1000,

    initialize: function () {
        var win = gui.Window.get();
        win.viewSettings = this;

        this.table = new gx.bootstrap.Table(new Element('div', {'class': 'fileList'}), {
            'cols': [
                {
                    'label': 'Filename',
                    'id': 'filename'
                }, {
                    'label': 'Password',
                    'id': 'password'
                }, {
                    'label': '',
                    'id': 'remove',
                    'width': '40px'
                }
            ],
            'structure': function(row, index) {
                var btnRemove = new Element('button', {'class': 'btn btn-xs btn-danger', 'html': '<span class="glyphicon glyphicon-trash"></span>'});
                btnRemove.addEvent('click', function() {
                    row.tr.destroy();
                    this.table._rows.erase(row);
                }.bind(this));

                row.txtPassword = new Element('input', {'type': 'password', 'class': 'form-control', 'value': row.password != null ? row.password : ''});

                return [
                    row.path,
                    row.txtPassword,
                    btnRemove
                ];
            }.bind(this),
            // 'data': data,
            'height': 300,
            'scroll': false,
            'selectable': false
        });

        this.gui = __({'class': 'settingsdialog pad-10', 'children': {
            'form': {'class': 'form', 'children': {
                'exec': {'class': 'form-group has-feedback', 'children': {
                    'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-cog"></span> KeePass Executable'},
                    'input': {'tag': 'input', 'type': 'text', 'class': 'form-control', 'placeholder': 'Select file'},
                    'icon': {'tag': 'span', 'type': 'text', 'class': 'glyphicon glyphicon-warning-sign form-control-feedback', 'aria-hidden': 'true'}
                }},
                'password': {'class': 'form-group', 'children': {
                    'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-lock"></span> Password'},
                    'input': {'tag': 'input', 'type': 'password', 'class': 'form-control'}
                }},
                'timeout': {'class': 'form-group', 'children': {
                    'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-pause"></span> Timeout'},
                    'input': {'tag': 'input', 'type': 'text', 'class': 'form-control'}
                }},
                'files': {'class': 'form-group', 'children': {
                    'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-th-list"></span> KeePass Files'},
                    'input': this.table
                }}
            }},
            'footer': {'class': 'footer', 'children': {
                'add'  : {'tag': 'button', 'type': 'button', 'class': 'left btn btn-default', 'html': '<span class="indicator glyphicon glyphicon-plus"></span> Add .kdbx file'},
                'save' : {'tag': 'button', 'type': 'submit', 'class': 'right mleft-10 btn btn-success', 'html': '<span class="indicator glyphicon glyphicon-ok"></span> Save'},
                'close': {'tag': 'button', 'type': 'button', 'class': 'right btn btn-danger', 'html': '<span class="indicator glyphicon glyphicon-remove"></span> Close'},
                'clear': {'class': 'clear'}
            }}
        }});

        this.txtPopupPassword = new Element('input', {'type': 'password', 'class': 'form-control'});
        this.txtPopupPassword.addEvent('keypress', function(event) {
            if (event.key == 'enter') {
                event.preventDefault();
                this.confirmOpen();
            }
        }.bind(this));
        this.popup = new gx.bootstrap.Popup({
            'title': 'Open settings',
            'content': {'class': 'form-group', 'children': {
                'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-lock"></span> Password'},
                'input': this.txtPopupPassword
            }},
            'footer': [
                new Element('button', {
                    'class': 'btn btn-warning',
                    'html': '<span class="glyphicon glyphicon-remove mright-15"></span> Cancel'
                }).addEvent('click', function() {
                        this.popup.hide();
                    }.bind(this)),
                new Element('button', {
                    'class': 'btn btn-success mleft-10',
                    'html': '<span class="glyphicon glyphicon-ok"></span> Open'
                }).addEvent('click', function() {
                        this.confirmOpen();
                    }.bind(this))
            ]
        });

        this.txtPassword = this.gui._form._password._input;

        this.execPicker = this.gui._form._exec;
        this.txtFilename = this.execPicker._input;
        this.txtFilename.addEvent('click', function() {
            this.selectFile('.exe', function(filename) {
                this.setExecPath(filename);
            }.bind(this));
        }.bind(this));

        this.gui._footer._add.addEvent('click', function() {
            this.selectFile('.kdbx', function(filename) {
                for (var i = 0 ; i < this.table._rows.length; i++) {
                    if (this.table._rows[i].path == filename)
                        return;
                }

                this.table.addData([{path: filename, password: ''}]);
            }.bind(this));
        }.bind(this));

        this.gui._footer._close.addEvent('click', function() {
            gui.Window.get().hide();
        }.bind(this));
        this.gui._footer._save.addEvent('click', function() {
            this.save();
        }.bind(this));
    },

    openSettings: function() {
        this.selectFile('.json', function(filename) {
            this.openFile = filename;
            this.popup.show();
            this.txtPopupPassword.focus();
        }.bind(this));
    },

    confirmOpen: function() {
        if (this.load(this.openFile, this.txtPopupPassword.get('value')))
            this.popup.hide();
        else
            alert('Invalid password');
    },

    setExecPath: function(path) {
        if (path == null) {
            this.execPicker.addClass('has-warning');
            this.execPicker.removeClass('has-success');
            this.execPicker._input.erase('value');
            this.execPicker._icon.addClass('glyphicon-warning-sign');
            this.execPicker._icon.removeClass('glyphicon-ok');
            return;
        }

        this.execPicker.removeClass('has-warning');
        this.execPicker.addClass('has-success');
        this.execPicker._input.set('value', path);
        this.execPicker._icon.removeClass('glyphicon-warning-sign');
        this.execPicker._icon.addClass('glyphicon-ok');
    },

    getExecPath: function() {
        return this.execPicker._input.get('value');
    },

    setTimeout: function(timeout) {
        this.gui._form._timeout._input.set('value', timeout);
    },

    getTimeout: function() {
        var timeout = parseInt(this.gui._form._timeout._input.get('value'));
        if (typeOf(timeout) == 'number')
            return Math.round(timeout);

        return this.defaulTimeout;
    },

    setPassword: function(password) {
        this.gui._form._password._input.set('value', password);
    },

    getPassword: function() {
        return this.gui._form._password._input.get('value');
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

    load: function(filename, password) {
        var conf = new Config({
            'filename': filename,
            'password': password
        });

        if (conf.read()) {
            this.setPassword(conf.password);
            this.setExecPath(conf.data.exec);
            this.setTimeout(conf.data.timeout);
            this.table.setData(conf.data.filelist);
            this.settingsFile = filename;
            return true;
        }

        return false;
    },

    save: function() {
        if (this.settingsFile == null) {
            this.selectFile('.json', function(filename) {
                this.writeSettingsFile(filename);
                global.ViewMain.setJsonPath(filename);
            }.bind(this), 'keepass.json');
            return;
        }

        this.writeSettingsFile(this.settingsFile);
    },

    writeSettingsFile: function(filename) {
        var filelist = [];
        this.table._rows.each(function(row) {
            filelist.push({
                path: row.path,
                password: row.txtPassword.get('value')
            });
        });

        var conf = new Config({
            'filename': filename,
            'password': this.getPassword()
        });
        conf.setFilelist(filelist);
        conf.setExec(this.getExecPath());
        conf.setTimeout(this.getTimeout());
        conf.write();
        gui.Window.get().hide();
    },

    close: function() {
        gui.Window.get().hide();
    },

    reset: function() {
        this.setExecPath();
        this.setTimeout(this.defaulTimeout);
        this.setPassword('');
        this.table.empty();
        this.settingsFile = null;
    }
});