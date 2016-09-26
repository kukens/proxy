var React = require('react');
var ReactDOM = require('react-dom');
var PoliciesActions = require('./PoliciesActions.jsx');

module.exports = React.createClass({

    addPolicy: function (e) {
        e.preventDefault();
        var data = $(e.target).closest("form").serializeArray();
        PoliciesActions.addPolicy(data);
    },

    handleNameChange: function(e){
        this.setState({name: e.target.value});
    },

    handleTestUrlChange: function (e) {
        this.setState({ testUrl: e.target.value });
    },

    getInitialState: function () {
        return { name: '' };
    },

    render: function () {

        return (
                <form id="modal-form">
                    <div className="modal-header">
                        <h3>Add policy</h3>
                        <p>Create a brand new policy.</p>
                        </div>
                    <div className="modal-body">
                    <fieldset>
                        <label htmlFor="name">Policy name:</label>
                        <input className="form-control" onChange={this.handleNameChange} id="alias" type="text" name="name" value={this.state.name} />

                        <label htmlFor="testUrl">Test URL:</label>
                        <input className="form-control" onChange={this.handleTestUrlChange} id="alias" type="text" name="testUrl" value={this.state.testUrl} />
                    </fieldset>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button onClick={this.addPolicy} type="button" id="update-policy-btn" className="btn btn-primary">Submit</button>
                    </div>
</form>
                )
    }
});
