var https = require("https");
var http = require("http");
require('mongoose').connect('mongodb://localhost:2000/wptproxy');
var Policy = require('./models/PolicyModel');

var policyId = "57bee1ade7b2da4827e43d9b";


http.createServer(function (req, res) {

    var fullUrl = 'http://' + req.headers.host + req.url;
    console.log(fullUrl);

    Policy.findOne({ _id: policyId }, { "tests": 1 }).exec(function (err, record) {

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
        else
        {
            res.end('no policy found');
        }
    });

}).listen(80);


