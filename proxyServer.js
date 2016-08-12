var Proxy = require('http-mitm-proxy');
var zlib = require('zlib');
var Policy = require('./models/PolicyModel');

var proxy = Proxy();

module.exports.init = function () {

    // curl -k https://localhost:8000/
    const https = require('https');
    const fs = require('fs');

    const options = {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    };

    https.createServer(options, (req, res) => {
        console.log(options);
        console.log(req);
        console.log('dupa');
      //  res.writeHead(200);
        res.end('hello world\n');
    }).listen(8081);;

}


