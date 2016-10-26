var React = require('react');
var ReactDOM = require('react-dom');
var RuleForm = require('./RuleForm.jsx');
var EditRuleLink = require('./EditRuleLink.jsx');
var TestSummary = require('./TestSummary.jsx');

module.exports = React.createClass({

    renderAddRuleForm: function (e) {
        ReactDOM.render(
            <RuleForm sessionId={this.props.session._id} sessionName={this.props.session.name} rule={{}} />, document.getElementById('modal-body')
        );

        $('#modal-window').modal('show');
    },


    render: function () {
        var rulesNodes = this.props.session.rules.map(function (rule) {
            return (
            <li key={rule._id }>
                <EditRuleLink sessionId={this.props.session._id} sessionName={this.props.session.name} rule={rule} />
            </li>
                );
        }.bind(this));

        var noRulesText = rulesNodes.length > 0 ? '' : (<p>No rules defined.</p>);

        return (
            <div className="row">
            <div className="col-md-8">
            <div className="rulesList">
                <h4>Rules:</h4>
              <ul>
                  {rulesNodes}
              </ul>
                {noRulesText}
                 <button type="button" onClick={this.renderAddRuleForm} className="add-rule-btn btn btn-sm btn-primary">Add rule</button>

                  <br />

            </div>
            </div>
            <div className="col-md-4">
                <TestSummary sessionId={this.props.session._id} />
            </div>
            </div>
  );
    }
});