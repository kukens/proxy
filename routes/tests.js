var express = require('express');
var router = express.Router();
var isLoggedIn = require('../helpers/routes.js').isLoggedIn;

var TestController = require('../controllers/TestController');

router.post('/tests/*', isLoggedIn, function (req, res, next) {
    TestController.run(req, res, next);
});

router.get('/tests/status/*', isLoggedIn, function (req, res, next) {
    TestController.status(req, res, next);
});
router.get('/tests/history/*', isLoggedIn, function (req, res, next) {
    TestController.history(req, res, next);
});

router.delete('/tests/*', isLoggedIn, function (req, res, next) {
    TestController.cancel(req, res, next);
});


module.exports = router;
