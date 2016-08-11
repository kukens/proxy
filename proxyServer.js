var Proxy = require('http-mitm-proxy');
var zlib = require('zlib');
var Policy = require('./models/PolicyModel');

var proxy = Proxy();

module.exports.init = function () {

    proxy.onError(function (ctx, err) {
        console.error('proxy error:', err);
    });


    proxy.onRequest(function (ctx, callback) {

        var fullUrl = ctx.proxyToServerRequestOptions.agent.protocol + '//' + ctx.clientToProxyRequest.headers.host + ctx.clientToProxyRequest.url;
        ctx.proxyToClientResponse.setHeader('wptProxyHit', 'true');

        console.log(ctx.clientToProxyRequest.headers.wptproxypolicy);
        console.log(fullUrl);


        Policy.findOne({ _id: ctx.clientToProxyRequest.headers.wptproxypolicy, 'properties.url': fullUrl }, {"properties.$": 1, _id: 0}).exec(function (err, match) {

            if (err) return console.error(err);

            if (match && match.properties) {

                var property = match.properties[0];

                if (fullUrl == property.url) {

                    property.headers.forEach(function (item) {
                        ctx.proxyToClientResponse.setHeader(item.name, item.value)
                    })

                    if (property.body != '') {
                        ctx.onResponseData(function (ctx, chunk, callback) {
                            return callback(null, null);
                        });
                        zlib.gzip(property.body, function (_, result) {
                            ctx.clientToProxyRequest.headers.proxyContentLength = result.length;

                            ctx.onResponseEnd(function (ctx, callback) {
                                ctx.proxyToClientResponse.end(result);
                            });
                        });
                    }
                }
            }

            return callback();

        });
    });
    console.log('Starting proxy server...')
    proxy.listen({ port: 8081, keepAlive: true });

}


