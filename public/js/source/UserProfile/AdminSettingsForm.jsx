var React = require('react');
var ReactDOM = require('react-dom');

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

    componentWillMount: function()
    {
        $.ajax({
            type: "GET",
            url: "/settings",
            success: (data)=> {
                this.setState({
                        numberOfRuns: data.numberOfRuns,
                        testLocation: data.testLocation,
                        apiKey: data.apiKey,
                        serverIP: data.serverIP
                    });
                },
                error: () => {
                    this.setState({ errorMessage: 'Unable to fetch admin settings' });
                }
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
            success: () => {
                this.setState({ successMessage: 'Settings updated sucessfully' });
                setTimeout(() => {
                    $('#modal-window').modal('hide');
                }, 1000)
            },
            error: () => {
                this.setState({ errorMessage: 'Error ocurred' });
            }
        });
    },


    render: function () {

        var message

        if (this.state.successMessage) {
            var message = <div className="alert alert-success" role="alert">{this.state.successMessage}</div>
        } else if (this.state.errorMessage) {
            var message = <div className="alert alert-warning" role="alert">{this.state.errorMessage}</div>
        }

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
                        <button onClick={this.updateSettings} type="button" id="update-test-btn" className="btn btn-primary">Submit</button>
                    </div>
                {message}
            </form>
                )
    }
});
