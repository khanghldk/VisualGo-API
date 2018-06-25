var db = require('../dbconnection');
var md5 = require('js-md5');

var Auth = {
    login: function(email, password, googleUID, callback) {
        if (googleUID !== null) {
            return db.query(
            	'SELECT u.uid, u.displayName, u.role FROM Account a, User u WHERE a.uid = u.accountUID and a.googleUID = ?', 
            	[googleUID], callback);

            //SELECT uid from Account WHERE googleUID=?

        } else {
            password = md5(password);
            return db.query(
            	'SELECT u.uid, u.displayName, u.role FROM Account a, User u WHERE a.uid = u.accountUID and a.email = ? and a.passwordEncode = ?', 
            	[email, password], callback);
        }
    }
}

module.exports = Auth;
