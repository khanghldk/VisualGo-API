var express = require('express');
var router = express.Router();
var Lesson = require('../models/Lesson');

router.get('/:uid', function(req, res, next) {
    let topicUID = req.params.uid;
    
    Lesson.getLessonsByTopicUID(topicUID, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })

})

module.exports = router;