var React = require('react');
var ReactDOM = require('react-dom');
var AddPropertyForm = require('./AddPropertyForm.jsx');
var EditPropertyForm = require('./EditPropertyForm.jsx');
var EditPropertyLink = require('./EditPropertyLink.jsx');

module.exports = React.createClass({

    renderAddPropertyForm: function (e) {
        ReactDOM.render(
            <AddPropertyForm policy={this.props.policy} />, document.getElementById('modal-body')
        );

        $('#modal-window').modal('show');
    },

    render: function () {
        var propertiesNodes = this.props.policy.properties.map(function (property) {
            return (
            <li key={property._id }>
                <EditPropertyLink policyId={this.props.policy._id} policyName={this.props.policy.name} property={property} />
            </li>
                );
        }.bind(this));

        var noPropertiesText = propertiesNodes.length > 0 ? '' : (<p>No properties defined</p>);

        return (
            <div className="propertiesList">
              <ul>
                  {propertiesNodes}
              </ul>
                {noPropertiesText}
                <button type="button" onClick={this.renderAddPropertyForm} className="add-property-btn btn btn-primary">+ Add property</button>
            </div>

  );
    }
});