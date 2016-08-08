var Policy = require('../models/PolicyModel.js');

var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

var mockgoose = require('mockgoose');

before(function (done) {
    mockgoose(mongoose).then(function () {
        mongoose.connect('mongodb://example.com/TestingDB', function (err) {
            done(err);
        });
    });
});

describe('...', function () {

    before(function () {
        var newPolicy = new Policy({ name: 'sample policy' });
        newPolicy.save(function (err) {
        });
    });


    it('should call back with true when repost exists', sinon.test(function (done) {
        var property = { url: 'dummy', _id: '5790b7323e93447432b89f25', body: 'dummy' };

        Policy.editProperty(property, function () {
            expect(Policy).to.be.true;
            done();
        });
    }));
});