var db = require('../dbconnection');

var Lesson = {

    getLessonsByTopicUID: function(topicUID, callback) {
        return db.query('SELECT * FROM Lesson WHERE topicUID = ?', [topicUID], callback);
    }
}

module.exports = Lesson;
