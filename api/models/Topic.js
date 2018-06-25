var db = require('../dbconnection');

var Topic = {

    getTopicsByCourseUID: function(courseUID, callback) {
        return db.query('SELECT * FROM Topic WHERE courseUID = ?', [courseUID], callback);
    }
}

module.exports = Topic;
