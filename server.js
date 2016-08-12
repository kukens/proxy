var http = require("http");


http.createServer(function (request, response) {

    console.log(request.url);
    console.log(request.headers.host);

    if (request.headers.host == 'psiepodworko.pl')
    {
        response.end('psiepodworko <script src="http://www.onet.pl/1.js" type="application/javascript" /> dupcia');
    }

}).listen(8084);

// curl -k https://localhost:8000/
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
}).listen(443);

console.log('listening');