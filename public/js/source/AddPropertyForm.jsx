var React = require('react');
var ReactDOM = require('react-dom');

var PoliciesActions = require('./PoliciesActions.jsx');
var PropertyHeaderList = require('./PropertyHeaderList.jsx');

module.exports = React.createClass({

    addProperty: function (e) {

        var data = $(e.target).closest("form").serializeArray();
        PoliciesActions.addProperty(this.props.policy._id, data);
        this.handleUnmountForm();
    },

      handleUrlChange: function(e){
        this.setState({url: e.target.value});
    },

    handleBodyChange: function(e){
        this.setState({body: e.target.value});
    },

    getInitialState: function () {
        return { url: '', body: ''};
    },

    getDefaultProps: function() {
        return {
            headers: []
        };
    },

    handleUnmountForm: function () {
        ReactDOM.unmountComponentAtNode(document.getElementById('modal-body'));
    },

    render: function () {

        var headersList = this.props.headers.map(function (header, index) {
            return (
                 <div></div>
                );
        }.bind(this));

        return (
            <form id="modal-form">
                  <div className="modal-header">
                <h3>Add property</h3>
                      <p>Add a new property to policy '{this.props.policy.name}' (ID: {this.props.policy._id}).</p>
                      </div>
                  <div className="modal-body">
                <fieldset>
                    <label htmlFor="url">URL to match:</label>
                    <input onChange={this.handleUrlChange} className="form-control" type="text" name="url" value={this.state.url} />
                </fieldset>
                     <PropertyHeaderList headers={this.props.headers} />

                <fieldset>
                    <label htmlFor="body">Overwrite HTTP body:</label>
                    <textarea onChange={this.handleBodyChange} className="form-control" name="body" rows="3" value={this.state.body} />
                </fieldset>
                      </div>
                    <div className="modal-footer">
                    <button onClick={this.handleUnmountForm} type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>

                    <button onClick={this.addProperty} type="button" id="update-property-btn" className="btn btn-primary">Submit</button>
                    </div>
</form>

                )
    }
});
  