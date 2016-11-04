var statusText;
var baseline;
var speedIndex;
var testId;
var userUrl;
var jsonUrl;
var finished;


function TestRunModel() {
    
    this.statusText = 'Pending...';
    this.speedIndex = null;
    this.testId = '';
    this.userUrl = '';
    this.jsonUrl = '';
    this.finished = null;
}

module.exports = TestRunModel;