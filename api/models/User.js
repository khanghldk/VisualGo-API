var db = require('../dbconnection');
var md5 = require('js-md5');

var User = {
    createNewUser: function(accountUID, displayName, role, callback) {
        var newUser = {
            "accountUID": accountUID,
            "displayName": displayName,
            "role": role
        }
        return db.query('INSERT INTO User SET ?', newUser, callback);
    },
    getAll: function(callback) {
        return db.query(
            'SELECT u.uid, a.email, u.displayName, u.role FROM Account a, User u WHERE a.uid = u.accountUID', callback);
    }
}

module.exports = User;
