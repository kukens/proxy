var https = require("https");
var http = require("http");
var Policy = require('./models/mongoose/PolicyModel');

module.exports = {
    init: function () {

        http.createServer(function (req, res) {

            var fullUrl = 'http://' + req.headers.host + req.url;
            console.log(fullUrl);

            Policy.findOne({ _id: req.headers.wptproxypolicy }, { "tests": 1 }).exec(function (err, record) {

                if (err) return console.log(err);

                var responses = record.tests[0]

                if (responses) {

                    var match = false;

                    for (var response in responses) {

                        if (responses[response].url == fullUrl) {
                            match = true;

                            for (var header in responses[response].headers) {
                                res.setHeader(header, responses[response].headers[header]);
                            }

                            res.headers = responses[response].headers;

                            if (res.headers['Content-Encoding'] == 'gzip') {
                                require('zlib').gzip(responses[response].body.buffer, function (_, result) {
                                    res.setHeader('Content-Length', result.length)
                                    res.end(result);
                                });
                            }
                            else {
                                res.end(responses[response].body.buffer);
                            }
                        }
                    }

                    if (!match) res.end('could not provide a response');
                }
                else {
                    res.end('no policy found');
                }
            });

        }).listen(80);



        console.log('http server started');


        const fs = require('fs');
        const options = {
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert')
        };


        https.createServer(options, function (req, res) {

            var fullUrl = 'https://' + req.headers.host + req.url;
            console.log(fullUrl);

            console.log(req.headers.wptproxypolicy);

            Policy.findOne({ _id: req.headers.wptproxypolicy }, { "tests": 1 }).exec(function (err, record) {

                if (err) return console.log(err);

                var responses = record.tests[0]

                if (responses) {

                    var match = false;

                    for (var response in responses) {

                        console.log(responses[response].url);
                        console.log(fullUrl);

                        if (responses[response].url == fullUrl) {
                            match = true;

                            for (var header in responses[response].headers) {
                                res.setHeader(header, responses[response].headers[header]);
                            }

                            res.headers = responses[response].headers;

                            if (res.headers['Content-Encoding'] == 'gzip') {
                                require('zlib').gzip(responses[response].body.buffer, function (_, result) {
                                    res.setHeader('Content-Length', result.length)
                                    res.status(responses[response].responseCode).end(result);
                                });
                            }
                            else {
                                res.status(responses[response].responseCode).end(responses[response].body.buffer);
                            }
                        }
                    }

                    if (!match) res.end('could not provide a response');
                }
                else {
                    res.end('no policy found');
                }
            });

        }).listen(443);

        console.log('https server started');


    }

}

