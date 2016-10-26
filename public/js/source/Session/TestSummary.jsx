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
                        console.log('dsds');
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
            type: "GET",
            url: "/tests/run/" + this.props.sessionId,
            success: function () {
                this.getTestStatus();
            }.bind(this)
        });
    },


    cancelTest: function (e) {
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/tests/cancel/" + this.props.sessionId,
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

       else  if (this.state.session) {

            if (this.state.session.performanceTest.finished) {
                testsFinishedBlock = <p>Last test finished: {new Date(this.state.session.performanceTest.finished).toLocaleString()}</p>
            } else {
                testsFinishedBlock = <p>Test started: {new Date(this.state.session.startDate).toLocaleString()} | <a href='#' onClick={this.cancelTest}>Cancel test</a></p>
            }

            runButtonDisabled = this.state.session.performanceTest.finished ? false : true;

            var baselineSpeedindex = this.state.session.baselineTest.speedIndex ? <span> - Speed Index: {this.state.session.baselineTest.speedIndex}</span> : <br />;
            var performanceSpeedindex = this.state.session.performanceTest.speedIndex ? <span> - Speed Index: {this.state.session.performanceTest.speedIndex}</span> : <br />;

            var baselineTestLink = this.state.session.baselineTest.userUrl ? <a target='_blank' href={this.state.session.baselineTest.userUrl }>{this.state.session.baselineTest.testId}</a> : '';
            var performanceTestLink = this.state.session.performanceTest.userUrl ? <a target="_blank" href={this.state.session.performanceTest.userUrl }>{this.state.session.performanceTest.testId}</a> : '';

            testsInfo =
              <div className="tests-runing">
                 <p>
                     Baseline test: {this.state.session.baselineTest.statusText}  <br />{baselineTestLink} {baselineSpeedindex}
                 </p>
              <p>
                  Performance test: {this.state.session.performanceTest.statusText}<br />{performanceTestLink} {performanceSpeedindex}
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
