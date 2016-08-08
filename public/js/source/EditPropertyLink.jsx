var React = require('react');
var ReactDOM = require('react-dom');

var EditPropertyForm = require('./EditPropertyForm.jsx');

module.exports = React.createClass({

  renderEditPropertyForm: function (e) {

        e.preventDefault();
        ReactDOM.render(
            <EditPropertyForm policyName={this.props.policyName} policyId={this.props.policyId} property={this.props.property} />, document.getElementById('modal-body')
        );
        $('#modal-window').modal('show');
        },

    render: function () {
        return (
              <a onClick={this.renderEditPropertyForm} className="add-property" href="#">{this.props.property.url}</a>
            )
}
});
