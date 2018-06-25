var db = require('../dbconnection');
var md5 = require('js-md5');

var SignUp = {
    signup: function (email, password, googleUID, callback) {
        if (password)
            password = md5(password);

        var Account = {
            "email": email,
            "passwordEncode": password,
            "googleUID": googleUID
        }
        return db.query('INSERT INTO Account SET ?', Account, callback);
    },
    checkExistedAccount: function (email, callback) {
        return db.query('Select uid from Account WHERE email=?'[email], callback);
    }
}

module.exports = SignUp;
