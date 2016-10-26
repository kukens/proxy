var passport = require('passport');
var User = require('../models/mongoose/UserModel.js');

module.exports = {
    register: function (req, res, next) {
        passport.authenticate('local-register', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/'); }
            req.logIn(user, function (err) {
                return res.redirect('/home');
            });
        })(req, res, next)
    },

    updateProfile: function (req, res, next) {

        User.findOne({ 'local.email': req.user.local.email }, function (err, user) {

            console.log(user);

            if (err) console.log(err);
            console.log(user.local.password);
            if (req.body.newPassword && user.validPassword(req.body.oldPassword)) {

                user.local.password = user.generateHash(req.body.newPassword);

                console.log(user.local.password);

                user.save(function (err) {
                    if (err) console.log('error');

                    console.log('passwrod changed');
                    res.end();
                });

            }

            
            res.end();
        })
    },

    logOn: function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/'); }

            req.logIn(user, function (err) {
                return res.redirect('/home');
            });
        })(req, res, next)
    },

    getUserName: function (req, res, next) {
        res.json({ user: req.user.local.email, role: req.user.role })
    },

    logOut: function (req, res, next) {
        req.logout();
        res.redirect('/');
    }

}
