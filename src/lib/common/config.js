var Config = new Class({
    algorithm: 'aes-256-ctr',
    password: '',
    filename: '',
    data: [],

    setFilename: function() {
        this.filename = filename;
    },

    setPassword: function() {
        this.password = password;
    },

    load: function() {

    },

    write: function() {

    },

    encryptString: function(text) {
        var cipher = crypto.createCipher(this.algorithm, this.password)
        var crypted = cipher.update(text,'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },

    decryptString: function(text) {
        var decipher = crypto.createDecipher(this.algorithm, this.password)
        var dec = decipher.update(text,'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
});



