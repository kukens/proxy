var mongoose = require('mongoose'), Schema = mongoose.Schema;

propertySchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    url: String,
    body: String,
    headers: [{ name: String, value: String }]
});

policySchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    name: String,
    properties: [propertySchema]
});


policySchema.statics.editProperty = function (property, callback) {
    if (!property.headers) property.headers = [];
    this.update({ 'properties._id': property._id }, { $set: { "properties.$": property } }, function (err, updated) {
        callback(err);
    });
}

var Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;

