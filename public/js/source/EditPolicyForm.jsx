var React = require('react');
var ReactDOM = require('react-dom');

var PoliciesList = require('./PoliciesList.jsx');
var PoliciesActions = require('./PoliciesActions.jsx');

module.exports = React.createClass({

    deletePolicy: function (e) {
        PoliciesActions.deletePolicy(this.props.policyId);
    },

    updatePolicy: function (e) {
        var data = $(e.target).closest("form").serializeArray();
        PoliciesActions.updatePolicy(this.props.policyId, data);
    },

    handleNameChange: function (e) {
        this.setState({ name: e.target.value });
    },

    getInitialState: function () {
        return {
            name: this.props.policyName,
            testUrl: this.props.testUrl
        };
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            name: nextProps.policyName,
            testUrl: nextProps.testUrl
        });
    },

    render: function () {

        return (
            <form id="modal-form">
                <div className="modal-header">
                    <h3>Edit policy</h3>
                    <p>Edit policy '{this.props.policyName}' (ID: {this.props.policyId}). </p>
                </div>
                <div className="modal-body">
                    <fieldset>
                        <label htmlFor="alias">Policy name:</label>
                        <input className="form-control" onChange={this.handleNameChange} id="alias" type="text" name="name" value={this.state.name} />

                        <label htmlFor="testUrl">Test URL:</label>
                        <input className="form-control" onChange={this.handleTestUrlChange} id="testUrl" type="text" name="name" value={this.state.testUrl} />

                    </fieldset>
                </div>

                    <div className="modal-footer">

                        <button onClick={this.deletePolicy} type="button" id="delete-property-btn" className="btn btn-danger">Delete policy</button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button onClick={this.updatePolicy} type="button" id="update-policy-btn" className="btn btn-primary">Submit</button>
                    </div>
            </form>
                )
    }
});
