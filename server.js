var http = require("http");


http.createServer(function (request, response) {

    console.log(request.url);
    console.log(request.headers.host);

    if (request.headers.host == 'psiepodworko.pl')
    {
        response.end('psiepodworko <script src="http://www.onet.pl/1.js" type="application/javascript" /> dupcia');
    }

}).listen(8087);

// curl -k https://localhost:8000/
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

https.createServer(options, (req, res) => {

    https.get('https://encrypted.google.com/', (res) => {
        console.log('statusCode: ', res.statusCode);
        console.log('headers: ', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

    }).on('error', (e) => {
        console.error(e);
    });

    res.writeHead(200);
    res.end('hello world\n');
}).listen(8088);

console.log('listening');


https.get('https://www.webpagetest.org/runtest.php?k=A.7f356743917964dd879378131da49b9f&runs=2&location=Dulles:Chrome&fvonly=1&ignoreSSL=1&bodies=1&script=setDns%09www.pearson.com%09127.0.0.4%0Anavigate%09http%3A%2F%2Fwww.psiepodworko.pl&f=json', function (res) {
    var body = '';
    var responseObject = {};
    res.on('data', (chunk) => {
        body += chunk;
    });
    res.on('end', function () {
        console.log(body);
        responseObject = JSON.parse(body);
        getResults(responseObject.data.jsonUrl);
    });
});

function getResults(jsonUrl)
{

    var interval = setInterval(function () {
        var body = '';
        var responseObject = {};

        https.get(jsonUrl, function (res) {
            console.log('Requesting ' + jsonUrl);

            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', function () {
                responseObject = JSON.parse(body);

                if (responseObject.statusCode == 200) {
                    console.log(responseObject.statusCode);
                    console.log(responseObject.statusText);
                    clearInterval(interval);
                }
                else {
                    console.log(responseObject.data.statusCode);
                    console.log(responseObject.data.statusText);
                }
            });    
        });
    }, 5000);
}