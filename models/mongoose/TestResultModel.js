var mongoose = require('mongoose'), Schema = mongoose.Schema;

testResultSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    policyId: { type: Schema.ObjectId, auto: true },
    baselineTest: {},
    performanceTest: {},
    startDate: String,
    finishDate: String
});

module.exports = mongoose.model('TestResult', testResultSchema);

