var db = require('../dbconnection');

var LearnedCourse = {

    getLearnedCourses: function(userUID, callback) {
        return db.query('SELECT * FROM LearnedCourse WHERE userUID = ?', [userUID], callback);
    },

    updateLearnedCourse: function(userUID, courseUID, currentLesson, currentSubLesson, callback) {        
        return db.query('UPDATE LearnedCourse ' 
                + 'SET currentLesson = ?, currentSubLesson = ? ' 
                + 'WHERE userUID = ? and courseUID = ?', 
                [currentLesson, currentSubLesson, userUID, courseUID], callback);
    }
}

module.exports = LearnedCourse;
