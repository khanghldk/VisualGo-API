var express = require('express');
var router = express.Router();
var Topic = require('../models/Topic');

router.get('/:uid', function(req, res, next) {
    let courseUID = req.params.uid;
    
    Topic.getTopicsByCourseUID(courseUID, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })

})

module.exports = router;