var express = require('express');
var router = express.Router();
var Signup = require('../models/SignUp');

router.post('/', function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let googleUID = req.body.googleUID;
    Signup.signup(email, password, googleUID, function (err, rows) {        
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;