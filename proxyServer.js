var Proxy = require('http-mitm-proxy');
var zlib = require('zlib');
var Policy = require('./models/PolicyModel');

var proxy = Proxy();

module.exports.init = function () {

    proxy.onError(function (ctx, err) {
        console.error('proxy error:', err);
    });


    proxy.onRequest(function (ctx, callback) {

        ctx.proxyToClientResponse.end("dupa sraka");

            //return callback();
    });
    console.log('Starting proxy server...')
    proxy.listen({ port: 8081, keepAlive: true });

}


