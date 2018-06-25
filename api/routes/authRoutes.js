var express = require('express');
var router = express.Router();
var Auth = require('../models/Auth');

router.post('/', function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let googleUID = req.body.googleUID;

    Auth.login(email, password, googleUID, function (err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });

});

module.exports = router;