var ViewSettings = new Class({
    initialize: function () {
        this.table = new gx.bootstrap.Table(null, {
            'cols': [
                {
                    'label': 'Name',
                    'id': 'customername'
                }, {
                    'label': 'Number',
                    'id': 'customernum',
                    'text-align': 'right'
                }, {
                    'label': 'Last change',
                    'id': 'lastmodified'
                }
            ],
            'structure': function(row) {
                return [
                    row.customername,
                    row.customernum,
                    new Date(row.lastmodified * 1000).format('%d.%m.%Y %H:%M')
                ];
            },
            // 'data': data,
            'height': 300,
            'scroll': true,
            'selectable': true
        });

        this.gui = __({'class': 'settingsdialog', 'children': {
            'filepicker': {'tag': 'input', 'type': 'file', 'styles': {'display': 'none'}},
            'exec': {'class': 'form-group has-feedback', 'children': {
                'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-user"></span> KeePass Executable'},
                'input': {'tag': 'input', 'type': 'text', 'class': 'form-control', 'placeholder': 'Select file'},
                'icon': {'tag': 'span', 'type': 'text', 'class': 'glyphicon glyphicon-warning-sign form-control-feedback', 'aria-hidden': 'true'}
            }},
            'files': {'class': 'form-group', 'children': {
                'label': {'tag': 'label', 'html': '<span class="glyphicon glyphicon-list"></span> KeePass Files'},
                'input': this.table
            }},
            'footer': {'class': 'ptop-10', 'children': {
                'close': {'tag': 'button', 'type': 'button', 'class': 'left btn btn-danger', 'html': '<span class="indicator glyphicon glyphicon-remove"></span> Close'},
                'save': {'tag': 'button', 'type': 'submit', 'class': 'right btn btn-success', 'html': '<span class="indicator glyphicon glyphicon-ok"></span> Save'},
                'load': {'tag': 'button', 'type': 'submit', 'class': 'right btn btn-primary mright-10', 'html': '<span class="indicator glyphicon  glyphicon-floppy-open"></span> Load'},
                'clear': {'class': 'clear'}
            }}
        }});

        this.gui._footer._close.addEvent('click', function() {
            console.log('close');
            gui.Window.get().hide();
        }.bind(this));

        this.gui._exec._input.addEvent('click', function() {
            this.selectFile('.exe', function(filename) {

            }.bind(this));
        }.bind(this));

        // this.selectFile('.kdbx', function(filename) {}.bind(this));

        this.gui._footer._load.addEvent('click', function() {
            this.selectFile('.json', function(filename) {}.bind(this));
        }.bind(this));
    },

    setExecPath: function(path) {
        if (path == null) {
            this.gui._exec.input.erase('value');
            this.gui._exec.addClass('has-warning');
            this.gui._exec.removeClass('has-success');
            this.gui._exec._icon.addClass('glyphicon-warning-sign');
            this.gui._exec._icon.removeClass('glyphicon-ok');
            return;
        }

        this.gui._exec.input.set('value', path);
        this.gui._exec.removeClass('has-warning');
        this.gui._exec.addClass('has-success');
        this.gui._exec._icon.removeClass('glyphicon-warning-sign');
        this.gui._exec._icon.addClass('glyphicon-ok');
    },

    selectFile: function (accept, callback) {
        this.gui._filepicker.set('accept', accept);
        this.gui._filepicker.removeEvent('change');
        this.gui._filepicker.addEvent('change', function() {
            callback(this.value);
        });
        this.gui._filepicker.click();
    }
});