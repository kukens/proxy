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
            var responseObject;

            for (var response in responses) {

                responseObject = responses[response];
                                
                if (responseObject.url == fullUrl) {
                    match = true;

                    console.log(response + ' - ' + responseObject.url + ' ' + fullUrl);

                    for (var header in responseObject.headers) {
                        res.setHeader(header, responseObject.headers[header]);
                    }

                    res.headers = responseObject.headers;

                    res.statusCode = responseObject.responseCode;

                    setTimeout(function () {
                        if (this.res.headers['Content-Encoding'] == 'gzip') {
                            require('zlib').gzip(this.responseObject.body.buffer, (_, result) => {
                                this.res.setHeader('Content-Length', result.length);
                                this.res.end(result);
                            });
                        }
                        else {
                            this.res.end(this.responseObject.body.buffer);
                        }
                    }.bind({ res: res, responseObject: responseObject }), responseObject.ttfb);
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
