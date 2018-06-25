var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.post('/', function (req, res, next) {
    let accountUID = req.body.accountUID;
    let displayName = req.body.displayName;
    let role = req.body.role;

    User.createNewUser(accountUID, displayName, role, function (err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});

router.get('/', function(req, res, next) {
    User.getAll(function (err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    })
});

module.exports = router;