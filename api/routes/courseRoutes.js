var express = require('express');
var router = express.Router();
var Course = require('../models/Course');

router.get('/', function (req, res, next) {
    Course.getall(function (err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })
});

router.post('/', function(req, res, next) {
    let courseName = req.body.courseName.replace(/-/g, ' ');

    Course.getCourseByName(courseName, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })
});

router.get('/:uid', function(req, res, next) {
    let uid = req.params.uid;
    Course.getByID(uid, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })
})

module.exports = router;