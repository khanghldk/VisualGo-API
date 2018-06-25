var db = require('../dbconnection');

var License = {

    getLicenses: function(userUID, callback) {
        return db.query('SELECT * FROM License WHERE userUID = ?', [userUID], callback);
    }
}

module.exports = License;
