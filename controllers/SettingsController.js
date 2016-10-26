var Settings = require('../models/mongoose/SettingsModel');

module.exports = {
    get: function (req, res, next) {

        Settings.findOne().exec()
        .then((settings) => res.json(settings))
        .catch((err) => next(err))
    },

    update: function (req, res, next) {

        Settings.findOne().exec()
        .then((settings) => {
            if (settings) {

                settings.numberOfRuns = req.body.numberOfRuns;
                settings.testLocation = req.body.testLocation;
                settings.apiKey = req.body.apiKey
                settings.serverIP = req.body.serverIP

                return settings.save();
            }
            else {
                var newSettings = new Settings({ testLocation: req.body.testLocation, numberOfRuns: req.body.numberOfRuns, apiKey: req.body.apiKey, serverIP: req.body.serverIP });

                return newSettings.save();
            }
        })
        .then(() => {
            res.end();
        })
        .catch((err) => next(err))

    }
}
