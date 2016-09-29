var mongoose = require('mongoose'), Schema = mongoose.Schema;

settingSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
   testLocation: String,
   numberOfRuns: String,
   apiKey: String,
   serverIP: String
});


var Settings = mongoose.model('Setting', settingSchema);

module.exports = Settings;

