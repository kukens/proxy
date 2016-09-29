var https = require("https");
var http = require("http");
var Policy = require('./models/mongoose/PolicyModel');
var fs = require('fs');

function findAndServeResponse(reg, res) {
    var fullUrl = 'http://' + req.headers.host + req.url;

    console.log(fullUrl);

    Policy.findOne({ _id: req.headers.wptproxypolicy }, { "tests": 1 }).exec(function (err, record) {

        if (err) return console.log(err);

        var testRun = parseInt(req.headers['user-agent'].match(/(.*\s)([1-9])(\/.*)/)[2]) || 1;

        var responses = record.tests[testRun-1]

        if (responses) {

            var match = false;

            for (var response in responses) {

                if (responses[response].url == fullUrl) {
                    match = true;

                    for (var header in responses[response].headers) {
                        res.setHeader(header, responses[response].headers[header]);
                    }

                    res.headers = responses[response].headers;

                    setTimeout(function () {
                        if (res.headers['Content-Encoding'] == 'gzip') {
                            require('zlib').gzip(responses[response].body.buffer, function (_, result) {
                                res.setHeader('Content-Length', result.length)
                                res.end(result);
                            });
                        }
                        else {
                            res.end(responses[response].body.buffer);
                        }
                    }, responses[response].ttfb);
                }
            }

            if (!match) res.end('could not provide a response');
        }
        else {
            res.end('no policy found');
        }
    });

}



module.exports = {
    init: function () {

        http.createServer(function (req, res) {
            findAndServeResponse(req, res);
        }).listen(80);

        console.log('http server started');

        https.createServer({
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert')
        }
        , function (req, res) {
            findAndServeResponse(req, res);
        }).listen(443);

        console.log('https server started');


    }

}

