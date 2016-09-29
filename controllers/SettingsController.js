var Settings = require('../models/mongoose/SettingsModel');

module.exports = {
    get: function (req, res, next) {

        Settings.findOne().exec(function (err, settings) {
            if (err) return next(err);

            return res.json(settings);
        });
    },

    update: function (req, res, next) {


        Settings.findOne().exec(function (err, settings) {
            if (err) console.log(err);

            console.log(req.body);

            if (settings)
            {

                settings.numberOfRuns = req.body.numberOfRuns;
                settings.testLocation = req.body.testLocation;
                settings.apiKey = req.body.apiKey
                settings.serverIP = req.body.serverIP

                settings.save(function (err) {
                    if (err) console.log(err);

                    return res.end();
                });
            }
            else
            {
                var newSettings = new Settings({ testLocation: req.body.testLocation, numberOfRuns: req.body.numberOfRuns, apiKey: req.body.apiKey, serverIP: req.body.serverIP });

                newSettings.save(function (err) {
                    if (err) console.log(err);
                });

                return res.end();
            }
        });
    }
}
