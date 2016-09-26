var Policy = require('../models/mongoose/PolicyModel');


var matchPolicyId = function (req) {
    var match = req.path.match(/\/policies\/([a-z0-9]{24})$|\/policies\/([a-z0-9]{24}?)\/.*/);
    return match[1] ? match[1] : match [2];
}

var matchPropertyId = function (req) {
    return req.path.match(/\/policies\/([a-z0-9]{24})\/properties\/([a-z0-9]{24})/)[2];
}


var responseCB = function(err, res)
{
    if (err) return next(err);
    return res.end();
}

    module.exports = {
        getPolicies: function (req, res, next) {
            Policy.find().exec(function (err, records) {
                if (err) return next(err);
                return res.json(records);
            });
        },

        editPolicy: function (req, res, next) {

            var policyId = matchPolicyId(req);

            Policy.update({ _id: policyId }, req.body, function (err, updated) {
                if (err) return next(err);
            });

            return res.end();
        },

        addPolicy: function (req, res, next) {

            var newPolicy = new Policy({ name: req.body.name, testUrl: req.body.testUrl });

            newPolicy.save(function (err) {
                if (err) return next(err);
            });

            return res.end();
        },

        deletePolicy: function (req, res, next) {

            var policyId = matchPolicyId(req);

            Policy.remove({ _id: policyId }, function (err) {
                if (err) return next(err);
            });

            return res.end();
        },


        editProperty: function (req, res, next) {
            var property = req.body;
            property._id = matchPropertyId(req);

            Policy.editProperty(property, function (err) {
                if (err) return next(err);
            });

            return res.end();
        },

        addProperty: function (req, res, next) {
            var policyId = matchPolicyId(req);

            var newProperty = req.body;

            Policy.update({ _id: policyId }, { $push: { properties: newProperty } }, function (err, updated) {
                if (err) return next(err);
            });

            return res.end();

        },

        deleteProperty: function (req, res, next) {
            var policyId = matchPolicyId(req);
            var propertyId = matchPropertyId(req);

            Policy.update({ _id: policyId }, { $pull: { properties: { _id: propertyId } } }, function (err, updated) {
                if (err) return next(err);
            });

            return res.end();
        }
    };