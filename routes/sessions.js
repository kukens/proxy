var express = require('express');
var router = express.Router();
var isLoggedIn = require('../helpers/routes.js').isLoggedIn;

var SessionController = require('../controllers/SessionController');

router.put('/sessions/*/rules/*', isLoggedIn, function(req, res, next) {
    SessionController.editRule(req, res, next);
});

router.post('/sessions/*/rules', isLoggedIn, function (req, res, next) {
    SessionController.addRule(req, res, next);
});

router.delete('/sessions/*/rules/*', isLoggedIn , function (req, res, next) {
    SessionController.deleteRule(req, res, next);
});

router.get('/sessions', isLoggedIn, function(req, res, next) {
    SessionController.getSessions(req, res, next);
});

router.put('/sessions/*', isLoggedIn, function(req, res, next) {
    SessionController.editSession(req, res, next);
});

router.post('/sessions', isLoggedIn, function (req, res, next) {
    SessionController.addSession(req, res, next);
});

router.delete('/sessions/*', isLoggedIn, function(req, res, next) {
    SessionController.deleteSession(req, res, next);
});

module.exports = router;

