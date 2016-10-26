var Session = require('../models/mongoose/SessionModel');

var matchSessionId = function (req) {
    var match = req.path.match(/\/sessions\/([a-z0-9]{24})$|\/sessions\/([a-z0-9]{24}?)\/.*/);
    return match[1] ? match[1] : match[2];
}

var matchRuleId = function (req) {
    return req.path.match(/\/sessions\/([a-z0-9]{24})\/rules\/([a-z0-9]{24})/)[2];
}

module.exports = {

    getSessions: function (req, res, next) {

        Session.find({ user: req.user.local.email}, { tests: 0 }).exec()
        .then((records) => res.json(records))
        .catch((err) => next(err))
    },

    editSession: function (req, res, next) {

        var sessionId = matchSessionId(req);

        Session.update({ _id: sessionId }, req.body).exec()
        .then(() => res.end())
        .catch((err) => next(err))
    },

    addSession: function (req, res, next) {

        var newSession = new Session({ name: req.body.name, testUrl: req.body.testUrl, user: req.user.local.email });

        newSession.save()
        .then(res.end())
        .catch((err) => next(err))
    },

    deleteSession: function (req, res, next) {

        var sessionId = matchSessionId(req);

        Session.remove({ _id: sessionId }).exec()
        .then(res.end())
        .catch((err) => next(err))
    },


    editRule: function (req, res, next) {

        var rule = req.body;
        rule._id = matchRuleId(req);
        if (!rule.headers) rule.headers = [];

        Session.update({ 'rules._id': rule._id }, { $set: { "rules.$": rule } }).exec()
        .then(res.end())
        .catch((err) => next(err))
    },

    addRule: function (req, res, next) {

        var sessionId = matchSessionId(req);
        var newRule = req.body;

        Session.update({ _id: sessionId }, { $push: { rules: newRule } }).exec()
        .then(()=> res.end())
        .catch((err) => next(err))
    },

    deleteRule: function (req, res, next) {

        var sessionId = matchSessionId(req);
        var ruleId = matchRuleId(req);

        Session.update({ _id: sessionId }, { $pull: { rules: { _id: ruleId } } }).exec()
        .then(()=> res.end())
        .catch((err) => next(err))
    }

};