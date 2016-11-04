var React = require('react');
var ReactDOM = require('react-dom');

var TestHistory = require('./TestHistory.jsx');

module.exports = React.createClass({

    componentWillMount: function () {
        this.getTestStatus();
    },

    getTestStatus: function () {
        var interval = setInterval(() => {
            $.ajax({
                type: "GET",
                url: "/tests/status/" + this.props.sessionId,
                success: function (data) {

                    if (data.performanceTest) {
                        this.setState({ test: data });
                        if (data.performanceTest.finished) {
                            clearInterval(interval);
                        }
                    }
                    else {
                        this.setState({});
                        clearInterval(interval);
                    }

                }.bind(this)
            });
        }, 2000);
    },

    showResults: function () {
        $.ajax({
            type: "GET",
            url: "/tests/history/" + this.props.sessionId,
            success: function (data) {
                ReactDOM.render(
                    <TestHistory results={data} />, document.getElementById('modal-body')
                );

                $('#modal-window').modal('show');
            }.bind(this)
        });
    },



    runTest: function (e) {

        e.target.disabled = true;

        $.ajax({
            type: "POST",
            url: "/tests/" + this.props.sessionId,
            success: function () {
                this.getTestStatus();
            }.bind(this)
        });
    },


    cancelTest: function (e) {
        e.preventDefault();
        $.ajax({
            type: "DELETE",
            url: "/tests/" + this.props.sessionId,
            success: function () {
                this.getTestStatus();
            }.bind(this)
        });
    },



    render: function () {

        var testsFinishedBlock;
        var testsInfo = <p>Loading...</p>;
        var runButtonDisabled = true;

        if (!this.state) {
            testsInfo = <p>Loading...</p>
        }

       else  if (this.state.test) {

            if (this.state.test.performanceTest.finished) {
                testsFinishedBlock = <p>Last test finished: {new Date(this.state.test.performanceTest.finished).toLocaleString()}</p>
            } else {
                testsFinishedBlock = <p>Test started: {new Date(this.state.test.startDate).toLocaleString()} | <a href='#' onClick={this.cancelTest}>Cancel test</a></p>
            }

            runButtonDisabled = this.state.test.performanceTest.finished ? false : true;

            var baselineSpeedindex = this.state.test.baselineTest.speedIndex ? <span> - Speed Index: {this.state.test.baselineTest.speedIndex}</span> : <br />;
            var performanceSpeedindex = this.state.test.performanceTest.speedIndex ? <span> - Speed Index: {this.state.test.performanceTest.speedIndex}</span> : <br />;

            var baselineTestLink = this.state.test.baselineTest.userUrl ? <a target='_blank' href={this.state.test.baselineTest.userUrl }>{this.state.test.baselineTest.testId}</a> : '';
            var performanceTestLink = this.state.test.performanceTest.userUrl ? <a target="_blank" href={this.state.test.performanceTest.userUrl }>{this.state.test.performanceTest.testId}</a> : '';

            testsInfo =
              <div className="tests-runing">
                 <p>
                     Baseline test: {this.state.test.baselineTest.statusText}  <br />{baselineTestLink} {baselineSpeedindex}
                 </p>
              <p>
                  Performance test: {this.state.test.performanceTest.statusText}<br />{performanceTestLink} {performanceSpeedindex}
              </p>
              </div>

        }
        else{
           testsInfo = <p>No tests started...</p>
           runButtonDisabled = false;
        }


        return (
            <div className='tests-summary'>
                <h4>Tests summary:</h4>
                {testsFinishedBlock}
                {testsInfo}

                <button type="button" disabled={runButtonDisabled} onClick={this.runTest} className="btn btn-sm btn-primary">Launch test</button>

                 <button type="button" onClick={this.showResults} className="btn btn-sm btn-primary">Show test history</button>
            </div>
                )
    }
});
