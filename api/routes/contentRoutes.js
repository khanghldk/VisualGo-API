var express = require('express');
var router = express.Router();
var Content = require('../models/Content');

router.get('/:uid', function(req, res, next) {
    let subLessonUID = req.params.uid;
    
    Content.getContentsBySubLessonUID(subLessonUID, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })

})

module.exports = router;