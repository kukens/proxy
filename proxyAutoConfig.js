var Policy = require('./models/PolicyModel');

module.exports.init = function () {
    {
        console.log('Starting pac...')
        require("http").createServer(function (request, response) {

            var policy = request.url.slice(1);

            Policy.findOne({ _id: policy }).exec(function (err, match) {

                var proxyText = 'function FindProxyForURL(url, host) {';

                proxyText += 'if (host == "localhost" || shExpMatch(host, "localhost.*") || host == "127.0.0.1") { \
                    return "DIRECT" \
                }';
                //if (err) {
                //    console.error(err);
                //}
                //else {
                   

                //        match.properties.forEach(function (item) {

                //            proxyText += 'if (url === "' + item.url + '") { \
                //            return "PROXY 127.0.0.1:8081"; \
                //          }';
                //        });
                    
                //}

                //return "PROXY 54.172.216.254:8081"; \
                //return "PROXY 127.0.0.1:8081"; \


                proxyText += 'return "PROXY 54.172.216.254:8081";}';

                response.setHeader('content-type', 'application/x-ns-proxy-autoconfig');
                response.end(proxyText);

            });
        }).listen(8080);
    }
}