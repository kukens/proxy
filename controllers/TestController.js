var TestResult = require('../models/mongoose/TestResultModel');
var Test = require('../models/Test');

var matchSessionId = function (req) {
    return req.path.match(/\/.*\/([a-z0-9]{24})/)[1];
}

module.exports = {
    run: function (req, res, next) {

        var sessionId = matchSessionId(req);

        if (!global.runningSessions[sessionId]) {
            var test = new Test(sessionId);
            global.runningSessions[sessionId] = test;
        }

        res.end();
        },

    status: function (req, res, next) {

        var sessionId = matchSessionId(req);

        if (global.runningSessions[sessionId])
        {
            return res.json({
                startDate: global.runningSessions[sessionId].startDate,
                baselineTest: global.runningSessions[sessionId].baselineTest,
                performanceTest: global.runningSessions[sessionId].performanceTest
            });
        }

        TestResult.find({ sessionId: sessionId }).sort({ startDate: 'desc' }).exec() 
        .then((results) => {
                if (results) {
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
        })
        .catch((err)=> next(err))
    },
     
           cancel: function (req, res, next) {

               var sessionId = matchSessionId(req);

               if (global.runningSessions[sessionId]) {
                   delete global.runningSessions[sessionId];
               }

               return res.end();
           },

           history: function (req, res, next) {

               var sessionId = matchSessionId(req);

               TestResult.find({ sessionId: sessionId }).sort({ startDate: 'desc' }).exec()
               .then((results)=> res.json(results))
               .catch((err) => next(err));
           }
           

    };