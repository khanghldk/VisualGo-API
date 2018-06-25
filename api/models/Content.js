var db = require('../dbconnection');

var Content = {

    getContentsBySubLessonUID: function(subLessonUID, callback) {
        return db.query('SELECT * FROM Content WHERE subLessonUID = ?', [subLessonUID], callback);
    }
}

module.exports = Content;
