var Policy = require('../models/mongoose/PolicyModel');
var TestResult = require('../models/mongoose/TestResultModel');
var Test = require('../models/Test');

var matchPolicyId = function (req) {
    return req.path.match(/\/test\/.*\/([a-z0-9]{24})/)[1];
}

module.exports = {
    run: function (req, res, next) {

        var policyId = matchPolicyId(req);

        if (!global.runningTests[policyId]) {
            var test = new Test(policyId);
            global.runningTests[policyId] = test;
        }

        return res.end();
        },

    status: function (req, res, next) {

        var policyId = matchPolicyId(req);

        var runningTest = global.runningTests[policyId];

        if (runningTest)
        {
            return res.json({
                startDate: runningTest.startDate,
                baselineTest: runningTest.baselineTest,
                performanceTest: runningTest.performanceTest
            });
        }

        TestResult.find({ policyId: policyId }).sort({ testFinishedAt: 'desc' }).exec(function (err, results) {
                if (err) return next(err);

                if (results) {
                    console.log(results[0]);
                    var lastTest = results[0];

                    if (lastTest) {
                        return res.json({
                            startDate: lastTest.startDate,
                            baselineTest: lastTest.baselineTest,
                            performanceTest: lastTest.performanceTest
                        });
                    }
                }

                    return res.json({});
            });

    },
    
           cancel: function (req, res, next) {

               var policyId = matchPolicyId(req);

               if (global.runningTests[policyId]) {
                   delete global.runningTests[policyId];

               }

               return res.end();
           },

           results: function (req, res, next) {
               var policyId = matchPolicyId(req);

               TestResult.find({ policyId: policyId }).sort({ startDate: 'desc' }).exec(function (err, results) {
                   if (err) return next(err);
                   return res.json(results);
               });
           }
           

    };