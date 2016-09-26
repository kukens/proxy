var React = require('react');
var Reflux = require('reflux');

var EditPolicyLink = require('./EditPolicyLink.jsx');
var PropertiesList = require('./PropertiesList.jsx');
var PoliciesStore = require('./PoliciesStore.jsx');

module.exports = React.createClass({

    mixins: [Reflux.connect(PoliciesStore, "policies")],

    render: function () {
        var policyNodes = this.state.policies.map(function (policy) {
            return (
                        <li key={policy._id}>
                              <EditPolicyLink policyId={policy._id} policyName={policy.name} testUrl={policy.testUrl} />
                              <PropertiesList policy={policy} />
                        </li>
                );
        }.bind(this));

        return (
            <div id="policies-container">
                <h2>WPT Proxy Policies:</h2>
                  <ul id="policies-list">{policyNodes}</ul>

            </div>
            );
    }
});