var Session = require('../models/mongoose/SessionModel');
var Settings = require('../models/mongoose/SettingsModel');
var TestResult = require('../models/mongoose/TestResultModel');
var TestRun = require('../models/TestRun');
var https = require('https');
var http = require("http");
var url = require('url')
var sessionId;
var baselineTest;
var performanceTest;
var startDate;

var wptBaselineTestUrl;
var wptPerfTestUrl;

//var apiKey = 'A.4a3f5a1750da127ccc924d692a3a806a';
//var apiKey = 'A.7f356743917964dd879378131da49b9f'

//54.197.30.21

function TestModel(sessionId) {

    this.sessionId = sessionId;
    this.startDate = new Date().toISOString();

    this.baselineTest = new TestRun();
    this.performanceTest = new TestRun();

    this.rulesHostNamesPattern;

    var settings = Settings.findOne().exec()
    var session = Session.findOne({ '_id': this.sessionId }).exec()

    Promise.all([settings, session])
    .then((result) => {

        settings = result[0];
        session = result[1];

        this.wptBaselineTestUrl = 'https://www.webpagetest.org/runtest.php?k=' + settings.apiKey + '&runs=' + settings.numberOfRuns + '&location=' + settings.testLocation + '&video=1&medianMetric=SpeedIndex&fvonly=1&ignoreSSL=1&bodies=1&script=navigate%09' + encodeURIComponent(session.testUrl) + '&f=json';

        var hostNames = [];

        for (i = 0; i < session.rules.length; i++) {
            hostNames.push(session.rules[i].url.match(/http[s]?:\/\/(.*?)($|\/.*)/)[1]);
        }

        var dnsEntries = hostNames.map((hostName) => {
            return 'setDns%09' + encodeURIComponent(hostName) + '%09' + encodeURIComponent(settings.webServerIPAddress) + '%0A';
        });

        this.wptPerfTestUrl = 'https://www.webpagetest.org/runtest.php?k=' + settings.apiKey + '&runs=' + settings.numberOfRuns + '&location=' + settings.testLocation + '&video=1&medianMetric=SpeedIndex&fvonly=1&ignoreSSL=1&bodies=1&script=' + dnsEntries.join('') + 'addHeader%09wptproxysession%3A%20' + this.sessionId + '%0Anavigate%09' + encodeURIComponent(session.testUrl) + '&ignoreSSL=1&appendua=%RUN%&f=json';

        this.rulesHostNamesPattern = Array.from(new Set(hostNames)).join('|');
    })
    .then(() => {return this.runTest(this.baselineTest, this.wptBaselineTestUrl)})
    .then((responseObject) => { return this.getResponsesForPerformanceTest(responseObject) })
    .then(() => { return this.runTest(this.performanceTest, this.wptPerfTestUrl) })
    .then(() => this.SaveTestResults())
    .catch(e=> {
        console.log(e.stack)
        var testFailedInfo = e.message
        this.baselineTest.finished ? this.performanceTest.statusText = testFailedInfo : this.baselineTest.statusText = testFailedInfo;
    })
}

TestModel.prototype.SaveTestResults = function () {
    var testResult = new TestResult({
        sessionId: this.sessionId,
        baselineTest: this.baselineTest,
        performanceTest: this.performanceTest,
        startDate: this.startDate,
    });

    return testResult.save()
    .then(() => {
        delete global.runningSessions[this.sessionId];
    });
}

TestModel.prototype.requestPromise = function (requestUrl, bodyAsBuffer=false, userAgent='wpt-proxy') {
    return new Promise((resolve, reject) => {

        var protocol;
        if (requestUrl.match(/https:\/\//)) protocol = https;
        else protocol = http;

        var urlObject = url.parse(requestUrl)

        var options = {
            hostname: urlObject.host,
            path: urlObject.path,
            headers: {'User-Agent': userAgent}
        };

        var req = protocol.request(options, res => {

            var body = bodyAsBuffer ? body = [] : body = '';

            // 'bodyAsBuffer' - when combining buffer data there may be some parse error when serializing data to JSON
            res.on('data', (chunk) => {
                bodyAsBuffer ? body.push(chunk) : body += chunk;
            });
            res.on('end', () => {
                bodyAsBuffer ? resolve(Buffer.concat(body)) : resolve(body);
            });
            res.on('error', (e) => {
                reject(e);
            });
        }).on('error', (e) => {
            reject(e);
        });

        req.end();
    })
}

TestModel.prototype.gzipPromise = function (object) {
    return new Promise((resolve, reject) => {
        require('zlib').gzip(object, (_, result) => {
            resolve(result);
        });
    })
}

TestModel.prototype.runTest = function (testRun, url) {

    var delay = function (miliSeconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, miliSeconds)
        })
    }

    var refresh = (testRun) => {
        return delay(1000)
        .then(() => 
        {
            return this.requestPromise(testRun.jsonUrl)
        })
        .then((body) => {
            var responseObject = {};
            require('fs').writeFile('ddd.txt', body);
            responseObject = JSON.parse(body);
            testRun.statusText = responseObject.statusText;

            if (responseObject.statusCode == 200) {
                testRun.finished = new Date().toISOString();
                testRun.speedIndex = responseObject.data.median.firstView.SpeedIndex;
                return responseObject;
            }
            return refresh(testRun);
        })
    }
    console.log('test - ' + url);

    return this.requestPromise(url)
        .then(body=> {
            var responseObject = JSON.parse(body);
            testRun.jsonUrl = responseObject.data.jsonUrl;
            testRun.userUrl = responseObject.data.userUrl;
            testRun.testId = responseObject.data.testId;
            return testRun
        })
        .then((testRun) => refresh(testRun))
}

TestModel.prototype.getResponsesForPerformanceTest = function (responseObject) {

    var runs = [];
    //need to convert objects to array to use 'map'
    for (var run in responseObject.data.runs) {
        runs.push(responseObject.data.runs[run]);
    }

    return Promise.all(runs.map((run) => {

        //match only those hostnames that we have some rules defined for url's of that hostname
        var requests = run.firstView.requests.filter((request) => {
            return this.rulesHostNamesPattern.match(request.host)
        })

        return Promise.all(requests.map((request) => {

            var response = {};
            response.url = request.full_url;
            response.path = request.url;
            response.headers = normalizeHeaders(request.headers.response);
            response.bodyUrl = request.body_url ? 'https://www.webpagetest.org' + request.body_url : request.full_url;
            response.responseCode = request.responseCode;
            response.ttfb = request.ttfb_ms;
            response.contentDownload = request.download_ms;

            return Session.findOne({ _id: this.sessionId, 'rules.url': request.full_url }, { "rules.$": 1, _id: 0 }).exec()
            .then(match => {
                if (match && match.rules) {
                    var rule = match.rules[0];
                    if (rule) {
                        rule.headers.forEach(function (item) {
                            response.headers[item.name.toLowerCase()] = item.value;
                        })

                        if (rule.ttfb) response.ttfb = rule.ttfb;

                        if (rule.body != '') {
                            delete response.headers['content-length'];
                            if (response.headers['content-encoding'] == 'gzip') {
                                return this.gzipPromise(rule.body)
                                .then(gzippedBody=> {
                                    response.body = new Buffer(gzippedBody);
                                })
                            }
                            else {
                                response.body = new Buffer(rule.body);
                                return
                            }
                        }
                    }
                }

                if (!response.url) console.log(request);
                //user-agent required to ensure that we reveive the same assets (f.ex. webp instead of jpeg)
                return this.requestPromise(response.bodyUrl, true, normalizeHeaders(request.headers.request)['user-agent'])
                    .then(body => {
                        if (response.headers['content-encoding'] == 'gzip' && request.body_url) {
                            return this.gzipPromise(body)
                            .then(gzippedBody=> {
                                delete response.headers['content-length'];
                                response.body = new Buffer(gzippedBody);
                            })
                        }
                        else {
                            response.body = body;
                        }
                    })
                
            })
            .then(() => {
               // response.headers['content-length'] = Buffer.byteLength(response.body);
                return response;
            })
        }))
        .then((responses) => {
            return responses;
        });
        return results
    }))
.then((results) => {
    return Session.update({ _id: this.sessionId }, { tests: results }).exec()
})
}

function normalizeHeaders(headers) {
    var normalizedHeaders = {};

    //remove 'HTTP/1.1 200 OK' etc..
    headers.splice(0, 1);

    for (var index in headers) {

        var headerParts = headers[index].split(': ');
        var headerKey = headerParts[0].toLowerCase();

        headerParts.splice(0, 1);
        var headerValue = headerParts.join();

        normalizedHeaders[headerKey] = headerValue;
    }

    normalizedHeaders['proxied'] = true;

    return normalizedHeaders;
}

module.exports = TestModel;
