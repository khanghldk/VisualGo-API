var express = require('express');
var router = express.Router();
var LearnedCourse = require('../models/LearnedCourse');

router.get('/:uid', function(req, res, next) {
    let userUID = req.params.uid;
    
    LearnedCourse.getLearnedCourses(userUID, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })
})

router.post('/', function(req, res, next) {
    LearnedCourse.updateLearnedCourse(
        userUID, courseUID, currentLesson, currentSubLesson,function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })
})

module.exports = router;