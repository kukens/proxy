var express = require('express');
var router = express.Router();

var PolicyController = require('../controllers/PolicyController');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/policies/*/properties/*', function(req, res, next) {
    PolicyController.editProperty(req, res, next);
});

router.post('/policies/*/properties', function (req, res, next) {
    PolicyController.addProperty(req, res, next);
});

router.delete('/policies/*/properties/*', function (req, res, next) {
    PolicyController.deleteProperty(req, res, next);
});

router.get('/policies', function(req, res, next) {
    PolicyController.getPolicies(req, res, next);
});

router.post('/policies/*', function(req, res, next) {
    PolicyController.editPolicy(req, res, next);
});

router.post('/policies', function (req, res, next) {
    PolicyController.addPolicy(req, res, next);
});

router.delete('/policies/*', function(req, res, next) {
    PolicyController.deletePolicy(req, res, next);
});

module.exports = router;
