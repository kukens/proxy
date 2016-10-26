var Session = require('../models/mongoose/SessionModel');
var Settings = require('../models/mongoose/SettingsModel');
var TestResult = require('../models/mongoose/TestResultModel');
var TestRun = require('../models/TestRun');
var https = require('https');
var http = require("http");

var sessionId;
var baselineTest;
var performanceTest;
var startDate;
var results;
var numberOfRuns;

var apiKey;
var testsToRun;
var webServerIPAddress;
var testLocation;

//var apiKey = 'A.4a3f5a1750da127ccc924d692a3a806a';
//var apiKey = 'A.7f356743917964dd879378131da49b9f'

//54.197.30.21

function TestModel(sessionId) {
    
    this.sessionId = sessionId;
    this.startDate = new Date().toISOString();

    this.baselineTest = new TestRun(true);
    this.performanceTest = new TestRun(false);

    this.numberOfRuns = 0;
    this.results = new Array();

    Settings.findOne().exec((err, settings) => {

        if (err || !settings) {
            console.log(err || 'no settings defined');
        }
        else {
            this.apiKey = settings.apiKey,
            this.testsToRun = settings.numberOfRuns,
            this.webServerIPAddress = settings.serverIP,
            this.testLocation = settings.testLocation

            this.runTest(this.baselineTest);
        }
    });
 
}


TestModel.prototype.runTest = function (testRun) {

    testRun.statusText = 'Starting...';

    Session.findOne({ '_id': this.sessionId }).exec((err, session) =>{
        if (err) return console.log(err);

        if (!this.baselineTest.finished) {
            var wptTestUrl = 'https://www.webpagetest.org/runtest.php?k=' + this.apiKey + '&runs=' + this.testsToRun + '&location=' + this.testLocation + '&video=1&medianMetric=SpeedIndex&fvonly=1&ignoreSSL=1&bodies=1&script=navigate%09' + encodeURIComponent(session.testUrl) + '&f=json';
        }
        else {
            var hostNames = [];

            for (i = 0; i < session.rules.length; i++) {
                hostNames.push(encodeURIComponent(session.rules[i].url.match(/http[s]?:\/\/(.*?)($|\/.*)/)[1]));
            }

           var dnsEntries = hostNames.map((hostName) => {
               return 'setDns%09' + hostName + '%09' + this.webServerIPAddress + '%0A';
            });

           var wptTestUrl = 'https://www.webpagetest.org/runtest.php?k=' + this.apiKey + '&runs=' + this.testsToRun + '&location=' + this.testLocation + '&video=1&medianMetric=SpeedIndex&fvonly=1&ignoreSSL=1&bodies=1&script=' + dnsEntries.join('') + 'addHeader%09wptproxysession%3A%20' + this.sessionId + '%0Anavigate%09' + encodeURIComponent(session.testUrl) + '&ignoreSSL=1&appendua=%RUN%&f=json';
        }

        console.log(this.sessionId + ' - ' + wptTestUrl);
        
        https.get(wptTestUrl, (res)=> {
            var body = '';
            var responseObject = {};
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                
                responseObject = JSON.parse(body);
                testRun.jsonUrl = responseObject.data.jsonUrl;
                testRun.userUrl = responseObject.data.userUrl;
                testRun.testId = responseObject.data.testId;
                this.getResults(testRun);
            });
        });
    });
}


TestModel.prototype.getResults = function (testRun) {
    var interval = setInterval(()=> {
        var body = '';
        var responseObject = {};

        https.get(testRun.jsonUrl, (res)=> {
            console.log(this.sessionId + ' - Requesting ' + testRun.jsonUrl);

            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', ()=> {
                responseObject = JSON.parse(body);
                testRun.statusText = responseObject.statusText;
                console.log(this.sessionId + ' - '  + testRun.statusText);

                if (responseObject.statusCode == 200 && !testRun.finished) {

                    clearInterval(interval);


                   testRun.finished = new Date().toISOString();
                    testRun.speedIndex = responseObject.data.median.firstView.SpeedIndex;

                    if (testRun.finished) {

                        if (testRun.baseline) {
                            this.getResponsesForPerformanceTest();
                        }

                        else {
                            console.log(this.sessionId + ' -------------------- Test finished ----------------------');

                            var testResult = new TestResult({
                                sessionId: this.sessionId,
                                baselineTest: this.baselineTest,
                                performanceTest: this.performanceTest,
                                startDate: this.startDate,
                            });

                            testResult.save((err) => {
                                if (err) console.log(err);
                                delete global.runningTests[this.sessionId];
                            });
                        }
                        
                    }
                }
            });
        });
    }, 2000);
}



TestModel.prototype.getResponsesForPerformanceTest = function () {
    Session.findOne({ _id: this.sessionId }).exec((err, match) => {

        hostNames = [];
        var hostNamesRegex = '';

        for (i = 0; i < match.rules.length; i++) {
            hostNames.push(match.rules[i].url.match(/http[s]?:\/\/(.*?)($|\/.*)/)[1]);
        }

        var hostNamesRegex = Array.from(new Set(hostNames)).join('|');
        console.log('hostNameRegex: ' + hostNamesRegex);

        https.get(this.baselineTest.jsonUrl, (res)=> {
            var body = '';
            var responseObject = {};
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', ()=> {
                responseObject = JSON.parse(body);

                this.numberOfRuns = Object.keys(responseObject.data.runs).length;

                for (var run in responseObject.data.runs) {

                    var hits = 0;

                    var responses = new Array();

                    for (var item in responseObject.data.runs[run].firstView.requests) {
                        // console.log(request.headers['host']);
                        var request = responseObject.data.runs[run].firstView.requests[item];
                        if (request.host.match(hostNamesRegex)) hits++;
                    }

                    console.log('run "' + run + '" hostname hits: ' + hits);

                    if (hits > 0) {
                        for (var item in responseObject.data.runs[run].firstView.requests) {
                            var request = responseObject.data.runs[run].firstView.requests[item];

                            if (request.host.match(hostNamesRegex)) {

                                var response = {};

                                var bodyUrl = request.body_url ? 'https://www.webpagetest.org' + request.body_url : request.full_url;

                                response.url = request.full_url;
                                response.path = request.url;
                                response.headers = normalizeHeaders(request.headers.response);
                                response.bodyUrl = bodyUrl;
                                response.responseCode = request.responseCode;
                                response.ttfb = request.ttfb_ms;
                                response.contentDownload = request.download_ms;

                                this.getResponses(request, response, responses, hits);
                            }
                        }
                    }
                }
            });
        });
    });
}


TestModel.prototype.getResponses = function (request, response, responses, hits) {
    Session.findOne({ _id: this.sessionId, 'rules.url': request.full_url }, { "rules.$": 1, _id: 0 },  (err, match) => {

        if (err) return console.error(err);
        if (match && match.rules) {

            var rule = match.rules[0];

            console.log(request.full_url);
            console.log(rule.url);

            if (request.full_url == rule.url) {

                rule.headers.forEach(function (item) {
                    response.headers[item.name] = item.value;
                })

                if (rule.ttfb) response.ttfb = rule.ttfb;

                if (rule.body != '') {
                    response.body = new Buffer(rule.body);

                    responses.push(response);

                    if (hits == responses.length) this.results.push(responses);
                    if (this.numberOfRuns == this.results.length) {
                        this.saveResponsesAndRunPerformanceTest();
                    }
                }
                else {
                    this.getBaselineResponse(request, response, responses, hits);
                }
            }
        }
        else {
            this.getBaselineResponse(request, response, responses, hits);
        }
    });
}


TestModel.prototype.getBaselineResponse = function (request, response, responses, hits) {

    if (response.bodyUrl.match(/https:\/\//)) {
        https.get(response.bodyUrl, (res)=>
        {
            var bodyBuff = [];

            res.on('data', (chunk) => {
                bodyBuff.push(chunk);
            });

            res.on('end', () => {
                response.body = Buffer.concat(bodyBuff);
                responses.push(response);

                if (hits == responses.length) this.results.push(responses);
                if (this.numberOfRuns == this.results.length) this.saveResponsesAndRunPerformanceTest();
            });

        })
    }
    else
    {
        http.get(response.bodyUrl, (res) => {
            var bodyBuff = [];

            res.on('data', (chunk) => {
                bodyBuff.push(chunk);
            });

            res.on('end', () => {
                response.body = Buffer.concat(bodyBuff);
                responses.push(response);

                if (hits == responses.length) this.results.push(responses);
                if (this.numberOfRuns == this.results.length) this.saveResponsesAndRunPerformanceTest();
            });

        })
    }
}


TestModel.prototype.saveResponsesAndRunPerformanceTest = function ()
{
    Session.update({ _id: this.sessionId }, { tests: this.results }, (err, updated)=> {
        if (err) return console.log(err);
        console.log(this.sessionId + ' ------------- Session updated with baseline responses ---------------');

        this.runTest(this.performanceTest, false);
    });
}


function normalizeHeaders(headers) {
    var normalizedHeaders = {};

    //remove 'HTTP/1.1 200 OK' etc..
    headers.splice(0, 1);

    for (var index in headers) {

        var headerParts = headers[index].split(': ');
        var headerKey = headerParts[0];

        headerParts.splice(0, 1);
        var headerValue = headerParts.join();

        normalizedHeaders[headerKey] = headerValue;
    }

    normalizedHeaders['proxied'] = true;

    return normalizedHeaders;
}



module.exports = TestModel;
