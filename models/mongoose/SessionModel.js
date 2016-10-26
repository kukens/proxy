var mongoose = require('mongoose'), Schema = mongoose.Schema;

ruleSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    url: String,
    body: String,
    ttfb: Number,
    headers: [{ name: String, value: String }]
});


sessionSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    name: String,
    testUrl: String,
    user: String,
    tests: [],
    rules: [ruleSchema]
});

var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;

