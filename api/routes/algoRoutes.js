var express = require('express');
var router = express.Router();
var Algo = require('../models/Algo');

router.get('/:uid', function(req, res, next) {
    let uid = req.params.uid;
    
    Algo.getAlgoByID(uid, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
})

module.exports = router;