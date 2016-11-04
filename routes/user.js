var express = require('express');
var router = express.Router();
var isLoggedIn = require('../helpers/routes.js').isLoggedIn;
var isAdmin = require('../helpers/routes.js').isAdmin;

var UserController = require('../controllers/UserController');

router.post('/user/register', function (req, res, next) {
    UserController.register(req, res, next);
});

router.post('/user/my-profile', isLoggedIn, function (req, res, next) {
    UserController.updateProfile(req, res, next);
});

router.post('/user/log-on', function (req, res, next) {
   UserController.logOn(req, res, next);
});

router.get('/user/log-out', isLoggedIn, function (req, res, next) {
    UserController.logOut(req, res, next);
});

router.get('/user', isLoggedIn, function (req, res, next) {
    UserController.getUserName(req, res, next);
});


module.exports = router;
