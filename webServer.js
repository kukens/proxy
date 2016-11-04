﻿var https = require("http2");
var http = require("http");
var Session = require('./models/mongoose/SessionModel');
var fs = require('fs');

function findAndServeResponse(req, res, protocol) {

    var fullUrl = protocol + '://' + req.headers.host + req.url;
    
    Session.findOne({ _id: req.headers.wptproxysession }, { "tests": 1 }).exec()
    .then(record=> {
        if (record) {

            var testRunNumberMatch = req.headers['user-agent'].match(/(.*\s)([1-9])(\/.*)/);
            var testRunNumber = testRunNumberMatch ? parseInt(testRunNumberMatch[2]) : 1;

            var responses = record.tests[testRunNumber - 1]

            if (responses) {

                var match = false;
                var responseObject;

                for (var response in responses) {

                    responseObject = responses[response];

                    if (responseObject.url == fullUrl) {
                        match = true;

                        console.log(response + ' - ' + responseObject.url + ' ' + fullUrl);
                       
                        for (var header in responseObject.headers) {
                            if (header != 'transfer-encoding' && header != 'connection') res.setHeader(header, responseObject.headers[header]);
                        }

                        res.statusCode = responseObject.responseCode;

                        setTimeout(function () {
                              return this.res.end(this.responseObject.body.buffer);
                        }.bind({ res: res, responseObject: responseObject }), responseObject.ttfb);
                    }
                }

                if (!match) return res.end('could not provide a response');
            }
            else {
                console.log('no test responses found');
                return res.end('no test responses found');
            }
        }
        else {
            console.log('no session found: ' + req.headers.wptproxysession + ' ' + fullUrl);
            return res.end('no session found');
        }
    })
    .catch(e=> console.log(e))
}



module.exports = {
    init: function () {

        http.createServer((req, res) => {
            findAndServeResponse(req, res, 'http');
        }).listen(80);

        console.log('http server started');

        https.createServer({
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert')
        }
        , (req, res) => {
            findAndServeResponse(req, res, 'https');
        }).listen(443);

        console.log('https server started');
    }
}
