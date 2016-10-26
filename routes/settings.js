var express = require('express');
var router = express.Router();
var isAdmin = require('../helpers/routes.js').isAdmin;

var SettingsController = require('../controllers/SettingsController');

router.get('/settings', isAdmin, function (req, res, next) {
    SettingsController.get(req, res, next);
});

router.post('/settings', isAdmin, function (req, res, next) {
    SettingsController.update(req, res, next);
});

module.exports = router;
