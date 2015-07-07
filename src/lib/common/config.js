var Config = new Class({
    algorithm: 'aes-256-ctr',
    password: '',
    filename: '',
    data: {
        challenge: '',
        salt: '',
        exec: '',
        filelist: []
    },

    initialize: function(options) {
        if (options != null) {
            this.setFilename(options.filename);
            this.setPassword(options.password);
        }
    },

    setFilename: function(filename) {
        this.filename = filename;
    },

    setPassword: function(password) {
        this.password = password;
        this.data.salt = this.createSalt();
        this.data.challenge = this.encryptString(this.data.salt + password);
    },

    setExec: function(filepath) {
        this.data.exec = filepath;
    },

    setTimeout: function(timeout) {
        this.data.timeout = timeout;
    },

    setFilelist: function(filelist) {
        this.data.filelist = filelist;
    },

    check: function(password) {
        return this.encryptString(this.data.salt + password) == this.data.challenge;
    },

    read: function() {
        this.data = JSON.parse(fs.readFileSync(this.filename));

        if (!this.check(this.password))
            return false;

        this.data.filelist.each(function(elem) {
            elem.password = this.decryptString(elem.password);
        }.bind(this));

        return true;
    },

    write: function(callback) {
        var data = Object.clone(this.data);
        data.filelist.each(function(elem) {
            elem.password = this.encryptString(elem.password);
        }.bind(this));
        fs.writeFileSync(this.filename, JSON.stringify(data));
    },

    createSalt: function() {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i=0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    encryptString: function(text) {
        var cipher = crypt.createCipher(this.algorithm, this.password);
        var crypted = cipher.update(text,'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },

    decryptString: function(text) {
        var decipher = crypt.createDecipher(this.algorithm, this.password);
        var dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
});



