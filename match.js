var https = require("https");
var http = require("http");
var fs = require('fs');
require('mongoose').connect('mongodb://localhost:2000/wptproxy');
var Policy = require('./models/PolicyModel');

Policy.findOne({ _id: "57a85d337c85efcc0e618524" }).exec(function (err, match) {

    var hostNames = [];

    for (i = 0; i < match.properties.length; i++) {
        hostNames.push(match.properties[i].url.match(/http[s]?:\/\/(.*?)($|\/.*)/)[1]);
    }

    console.log(Array.from(new Set(hostNames)).join('|'));
    //uniqueArray = a.filter(function (item, pos) {
    //    return a.indexOf(item) == pos;
    //})
});
