var db = require('../dbconnection');

var Algo = {

    getAlgoByID: function(uid, callback) {
        return db.query(
            'SELECT * from Algorithms where uid = ?', [uid], callback
        );
    }
}

module.exports = Algo;
