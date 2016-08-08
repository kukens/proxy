var React = require('react');
var ReactDOM = require('react-dom');

var PoliciesActions = require('./PoliciesActions.jsx');
var PropertyHeaderList = require('./PropertyHeaderList.jsx');

module.exports = React.createClass({

      deleteProperty: function (e) {
        PoliciesActions.deleteProperty(this.props.policyId, this.props.property._id);
    },

      updateProperty: function (e) {
          var data = $(e.target).closest("form").serializeArray();
        PoliciesActions.updateProperty(this.props.policyId, this.props.property._id, data);
    },

    handleUrlChange: function (e) {
        this.setState({ url: e.target.value });
    },

    handleBodyChange: function (e) {
        this.setState({ body: e.target.value });
    },

    handleCloseForm: function () {
        PoliciesActions.fetchPolicies();
    },

    getInitialState: function () {
        return {
            url: this.props.property.url,
            body: this.props.property.body
        }
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            url: nextProps.property.url,
            body: nextProps.property.body
        });
    },


    render: function () {

       return (
             <form id="modal-form">
                 <div className="modal-header">
                    <h3>Edit property</h3>
                    <p>Edit a property of policy '{this.props.policyName}' (ID: {this.props.policyId}).</p>
                 </div>
                <div className="modal-body">
                <div className="form-group">
                <fieldset>
                    <label htmlFor="url">URL to match:</label>
                    <input onChange={this.handleUrlChange} className="form-control" type="text" name="url" value={this.state.url} />
                </fieldset>
                </div>
                     <PropertyHeaderList headers={this.props.property.headers} />

                <div className="form-group">
                <fieldset>
                    <label htmlFor="body">Overwrite HTTP body:</label>
                    <textarea onChange={this.handleBodyChange} className="form-control" name="body" rows="3" value={this.state.body} />
                </fieldset>
                </div>


                </div>
                  <div className="modal-footer">
                       <button onClick={this.deleteProperty} type="button" id="delete-property-btn" className="btn btn-danger">Delete property</button>
                       <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button onClick={this.updateProperty} type="button" id="update-property-btn" className="btn btn-primary">Submit</button>
                  </div>
            </form>

                )
    }
});
