var db = require('../dbconnection');

var Course = {

    getall: function(callback) {
        return db.query('SELECT * FROM Course', callback);
    },

    getByID: function(ID, callback) {
        return db.query('SELECT * FROM Course WHERE uid = ?', [ID], callback);
    },

    getCourseByName: function(courseName, callback) {
        return db.query('SELECT * FROM Course WHERE name like ?', [courseName], callback);
    }

}

module.exports = Course;
