var express = require('express');
var router = express.Router();
var isLoggedIn = require('../helpers/routes.js').isLoggedIn;
var isAdmin = require('../helpers/routes.js').isAdmin;

router.get('/', function (req, res, next) {
    if (req.user) res.redirect('/home');
    else res.render('index');
});

router.get('/register', isAdmin, function (req, res, next) {
    res.render('register');
});


router.get('/home', isLoggedIn, function (req, res, next) {
    res.render('home');
});


module.exports = router;
