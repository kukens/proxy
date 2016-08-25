var https = require("https");
var http = require("http");
var fs = require('fs');

var mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:2000/bin');

imageSchema = new Schema({
    data: Object
});

var Image = mongoose.model('Image', imageSchema);



http.get('http://psiepodworko.pl/', function (res) {

    var body = [];
  
    res.on('data', (chunk) => {
        body.push(chunk);
    });

    res.on('end', function () {
        
        image = new Image();

        var data = {};
        data.body = Buffer.concat(body);

        image.data = data;
        image.save(function (err) {
            if (err) return console.log(err);
        });

    });
});




http.createServer(function (req, res) {

    Image.find().exec(function (err, record) {
        if (err) console.log(err);
        //res.setHeader('content-encoding', 'gzip');
        //res.setHeader('transfer-encoding', 'chunked');
        //require('zlib').gzip(record[0].data, function (_, result) {
        //    res.end(result);
        //});

        console.log(record[0].data.body.buffer);
        res.end(record[0].data.body.buffer);
    });

}).listen(80);


