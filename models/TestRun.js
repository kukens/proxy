var statusText;
var baseline;
var speedIndex;
var testId;
var userUrl;
var jsonUrl;
var finished;


function TestRunModel(isBaseline) {
    
    this.statusText = 'Pending...';
    this.baseline = isBaseline;
    this.speedIndex = null;
    this.testId = '';
    this.userUrl = '';
    this.jsonUrl = '';
    this.finished = null;
}

module.exports = TestRunModel;