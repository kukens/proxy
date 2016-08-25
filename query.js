var https = require("https");
var http = require("http");
var fs = require('fs');
require('mongoose').connect('mongodb://localhost:2000/wptproxy');
var Policy = require('./models/PolicyModel');
var zlib = require('zlib');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var results = [];
var numberOfRuns = 0;

var policyId = "57bee1ade7b2da4827e43d9b";

Policy.findOne({ _id: policyId }).exec(function (err, match) {

    var hostNames = [];
    var hostNAmesRegex = '';

    for (i = 0; i < match.properties.length; i++) {
        hostNames.push(match.properties[i].url.match(/http[s]?:\/\/(.*?)($|\/.*)/)[1]);
    }

    var hostNAmesRegex = Array.from(new Set(hostNames)).join('|');
    console.log('hostNameRegex: ' + hostNAmesRegex);

    https.get('https://www.webpagetest.org/jsonResult.php?test=160818_HE_F48', function (res) {
        var body = '';
        var responseObject = {};
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', function () {
            responseObject = JSON.parse(body);

            numberOfRuns = Object.keys(responseObject.data.runs).length;

            for (var run in responseObject.data.runs) {

                var hits = 0;

                var responses = new Array();

                for (var item in responseObject.data.runs[run].firstView.requests) {
                    var request = responseObject.data.runs[run].firstView.requests[item];
                    if (request.host.match(hostNAmesRegex)) hits++;
                }

                console.log('run "' + run + '" hostname hits: ' + hits);

                if (hits > 0) {
                    for (var item in responseObject.data.runs[run].firstView.requests) {
                        var request = responseObject.data.runs[run].firstView.requests[item];

                        if (request.host.match(hostNAmesRegex)) {

                            var response = {};

                            var bodyUrl = request.body_url ? 'https://www.webpagetest.org' + request.body_url : request.full_url;

                            response.url = request.full_url;
                            response.path = request.url;
                            response.headers = normalizeHeaders(request.headers.response);
                            response.bodyUrl = bodyUrl;

                            //if (bodyUrl.match(/https:\/\//)) {
                            //    https.get(bodyUrl, sendRequest.bind({ ress: response, hits: hits, responsess: responses }));
                            //}
                            //else {
                            //    http.get(bodyUrl, sendRequest.bind({ ress: response, hits: hits, responsess: responses }));
                            //}


                            Policy.findOne({ _id: policyId, 'properties.url': request.full_url }, { "properties.$": 1, _id: 0 }, function (err, match) {

                                var request = this.request;
                                var response = this.response;
                                var responses = this.responses;
                                var hits = this.hits;

                                if (err) return console.error(err);
                                if (match && match.properties) {

                                    var property = match.properties[0];

                                    console.log(request.full_url);
                                    console.log(property.url);

                                    if (request.full_url == property.url) {

                                        property.headers.forEach(function (item) {
                                            response.headers[item.name] = item.value;
                                        })

                                        //if (property.body != '') {
                                            
                                        //    if (response.headers['Content-Encoding'] == 'gzip') {
                                        //        zlib.gzip(property.body, function (_, result) {
                                        //            response.headers['Content-Length'] = result.length;
                                        //            response.body = result;
                                        //        });
                                        //    }
                                        //    else
                                        //    {
                                        //        response.headers['Content-Length'] = property.body.length;
                                        //        response.body = property.body;
                                        //    }

                                        //    responses.push(response);

                                        //    if (hits == responses.length) results.push(responses);
                                        //    if (numberOfRuns == results.length) eventEmitter.emit('doorOpen');
                                        //}
                                        //else {
                                        //    if (bodyUrl.match(/https:\/\//)) {
                                        //        https.get(bodyUrl, sendRequest.bind({ ress: response, hits: hits, responsess: responses }));
                                        //    }
                                        //    else {
                                        //        http.get(bodyUrl, sendRequest.bind({ ress: response, hits: hits, responsess: responses }));
                                        //    }
                                        //}
                                    }
                                }
             //                   else {
               //                 }
                            }.bind({ request: request, response: response, responses: responses, hits: hits }));

                            if (bodyUrl.match(/https:\/\//)) {
                                https.get(bodyUrl, sendRequest.bind({ ress: response, hits: hits, responsess: responses }));
                            }
                            else {
                                http.get(bodyUrl, sendRequest.bind({ ress: response, hits: hits, responsess: responses }));
                            }
                        }
                    }
                }
            }
        });
    });
});


function sendRequest(res) {

    var bodyBuff = [];

    var hits = this.hits;
    var responsess = this.responsess;
    var ress = this.ress;

    res.on('data', (chunk) => {
        bodyBuff.push(chunk);
    });

    res.on('end', function () {
        
        ress.body = Buffer.concat(bodyBuff);
        responsess.push(ress);

        if (hits == responsess.length) results.push(responsess);
        if (numberOfRuns == results.length) eventEmitter.emit('doorOpen');
    });
}

eventEmitter.on('doorOpen', function () {

    Policy.update({ _id: policyId }, { tests: results }, function (err, updated) {
        if (err) return console.log(err);
        console.log('ok');
    });
});

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



