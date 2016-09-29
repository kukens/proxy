var React = require('react');
var ReactDOM = require('react-dom');

var PoliciesList = require('./PoliciesList.jsx');
var PoliciesActions = require('./PoliciesActions.jsx');

module.exports = React.createClass({

    getInitialState: function () {

        $('#modal-window').modal('show');

        return {
            numberOfRuns: '',
            testLocation: '',
            apiKey: '',
            serverIP: ''
        };

    },

    componentDidMount: function()
    {
        $.ajax({
            type: "GET",
            url: "/settings",
            success: function (data) {
                if (data) {
                    this.setState({
                        numberOfRuns: data.numberOfRuns,
                        testLocation: data.testLocation,
                        apiKey: data.apiKey,
                        serverIP: data.serverIP
                    });
                }
            }.bind(this)
        });
    },

   handleNumberOfRunsChange: function (e) {
        this.setState({ numberOfRuns: e.target.value });
    },

    handleTestLocationChange: function (e) {
        this.setState({ testLocation: e.target.value });
    },


    handleApiKeyChange: function (e) {
        this.setState({ apiKey: e.target.value });
    },

    handleServerIPChange: function (e) {
        this.setState({ serverIP: e.target.value });
    },

    
    updateSettings: function (e) {
        var data = $(e.target).closest("form").serializeArray();

        $.ajax({
            type: "POST",
            url: "/settings",
            data: data,
            success: function (data) {
                this.setState({
                    numberOfRuns: data.numberOfRuns,
                    testLocation: data.testLocation,
                    apiKey: data.apiKey,
                    serverIP: data.serverIP,
                });
                $('#modal-window').modal('hide');
            }.bind(this)
        });
    },


    render: function () {

        return (
            <form id="modal-form">
                <div className="modal-header">
                    <h3>Edit global settings</h3>
                </div>
                <div className="modal-body">
                    <fieldset>
                        <label htmlFor="numberOfRuns">Number of runs per test:</label>
                        <input className="form-control" onChange={this.handleNumberOfRunsChange} id="alias" type="text" name="numberOfRuns" value={this.state.numberOfRuns} />

                        <label htmlFor="testLocation">WPT test location:</label>
                        <input className="form-control" onChange={this.handleTestLocationChange} id="testUrl" type="text" name="testLocation" value={this.state.testLocation} />

                        <label htmlFor="apiKey">WPT API key:</label>
                        <input className="form-control" onChange={this.handleApiKeyChange} id="testUrl" type="text" name="apiKey" value={this.state.apiKey} />

                         <label htmlFor="serverIP">Web server IP address:</label>
                        <input className="form-control" onChange={this.handleServerIPChange} id="testUrl" type="text" name="serverIP" value={this.state.serverIP} />


                    </fieldset>
                </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button onClick={this.updateSettings} type="button" id="update-policy-btn" className="btn btn-primary">Submit</button>
                    </div>
            </form>
                )
    }
});
