var https = require("https"); 0
var http = require("http");
var Policy = require('./models/mongoose/PolicyModel');
var fs = require('fs');

function findAndServeResponse(req, res, protocol) {
    var fullUrl = protocol + '://' + req.headers.host + req.url;

    Policy.findOne({ _id: req.headers.wptproxypolicy }, { "tests": 1 }, (err, record) => {

        if (err) return console.log(err);

        var testRunNumberMatch = req.headers['user-agent'].match(/(.*\s)([1-9])(\/.*)/);
        var testRunNumber = testRunNumberMatch ? parseInt(testRunNumberMatch[2]) : 1;

        var responses = record.tests[testRunNumber - 1]

        if (responses) {

            var match = false;

            for (var response in responses) {
                //   console.log(responses[response].url + ' ' + fullUrl);
                if (responses[response].url == fullUrl) {
                    match = true;


                    for (var header in responses[response].headers) {
                        res.setHeader(header, responses[response].headers[header]);
                    }

                    res.headers = responses[response].headers;

                    res.statusCode = responses[response].responseCode;


                    setTimeout(function (res, responses, response) {
                        if (res.headers['Content-Encoding'] == 'gzip') {
                            require('zlib').gzip(responses[response].body.buffer, function (_, result) {
                                res.setHeader('Content-Length', result.length);
                                res.end(result);
                            });
                        }
                        else {
                            res.end(responses[response].body.buffer);
                        }
                    }(res, responses, response), responses[response].ttfb);

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

        http.createServer((req, res) => {
            findAndServeResponse(req, res, 'http');
        }).listen(81);

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
