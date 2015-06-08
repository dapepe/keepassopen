var ViewSettings = new Class({
    initialize: function () {
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

        this.gui = __({'class': 'settingsdialog', 'children': {
            'table': {'tag': 'table', 'children': {
                'row1': {'tag': 'tr', 'children': {
                    'body': {'tag': 'td', 'valign': 'top', 'rowspan': 2, 'children': {
                        'exec': {'class': 'form-group has-feedback', 'children': {
                            'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-cog"></span> KeePass Executable'},
                            'input': {'tag': 'input', 'type': 'text', 'class': 'form-control', 'placeholder': 'Select file'},
                            'icon': {'tag': 'span', 'type': 'text', 'class': 'glyphicon glyphicon-warning-sign form-control-feedback', 'aria-hidden': 'true'}
                        }},
                        'password': {'class': 'form-group', 'children': {
                            'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-lock"></span> Password'},
                            'input': {'tag': 'input', 'type': 'password', 'class': 'form-control'}
                        }},
                        'files': {'class': 'form-group', 'children': {
                            'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-th-list"></span> KeePass Files'},
                            'input': this.table
                        }}
                    }},
                    'menu1': {'tag': 'td', 'valign': 'top', 'children': {
                        'load': {'tag': 'button', 'type': 'submit', 'class': 'btn btn-primary', 'html': '<span class="indicator glyphicon glyphicon-floppy-open"></span> Load settings file'},
                        'add': {'tag': 'button', 'type': 'submit', 'class': 'btn btn-default', 'html': '<span class="indicator glyphicon glyphicon-plus"></span> Add .kdbx'}
                    }}
                }},
                'row2': {'tag': 'tr', 'children': {
                    'menu2': {'tag': 'td', 'valign': 'bottom', 'children': {
                        'close': {'tag': 'button', 'type': 'button', 'class': 'btn btn-danger', 'html': '<span class="indicator glyphicon glyphicon-remove"></span> Close'},
                        'save': {'tag': 'button', 'type': 'submit', 'class': 'btn btn-success', 'html': '<span class="indicator glyphicon glyphicon-ok"></span> Save'},
                    }}
                }}
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

        this.txtPassword = this.gui._table._row1._body._password._input;

        this.execPicker = this.gui._table._row1._body._exec;
        this.txtFilename = this.execPicker._input;
        this.txtFilename.addEvent('click', function() {
            this.selectFile('.exe', function(filename) {
                this.setExecPath(filename);
            }.bind(this));
        }.bind(this));

        this.gui._table._row1._menu1._load.addEvent('click', function() {
            this.openSettings();
        }.bind(this));

        this.gui._table._row1._menu1._add.addEvent('click', function() {
            this.selectFile('.kdbx', function(filename) {
                this.table.addData([{path: filename, password: ''}]);
            }.bind(this));
        }.bind(this));


        this.gui._table._row2._menu2._close.addEvent('click', function() {
            gui.Window.get().hide();
        }.bind(this));
        this.gui._table._row2._menu2._save.addEvent('click', function() {
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

    setPassword: function(password) {
        this.gui._table._row1._body._password._input.set('value', password);
    },

    getPassword: function() {
        return this.gui._table._row1._body._password._input.get('value');
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
            this.table.setData(conf.data.filelist);
            return true;
        }

        return false;
    },

    save: function() {
        var filelist = [];
        this.table._rows.each(function(row) {
            filelist.push({
                path: row.filepath,
                password: row.txtPassword.get('value')
            });
        });

        this.selectFile('.json', function(filename) {
            var conf = new Config({
                'filename': filename,
                'password': this.getPassword()
            });
            conf.setFilelist(filelist);
            conf.setExec(this.getExecPath());
            conf.write();
            gui.Window.get().hide();
        }.bind(this), 'keepass.json');
    }
});