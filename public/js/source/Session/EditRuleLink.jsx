import React from 'react';
import ReactDOM from 'react-dom';

var RuleForm = require('./RuleForm.jsx');

module.exports = React.createClass({

  renderEditRuleForm: function (e) {

        e.preventDefault();
        ReactDOM.render(
            <RuleForm sessionName={this.props.sessionName} sessionId={this.props.sessionId} rule={this.props.rule} />, document.getElementById('modal-body')
        );
        $('#modal-window').modal('show');
        },

    render: function () {
        return (
            <span>
             {this.props.rule.url} - <a onClick={this.renderEditRuleForm} className="add-rule" href="#">Edit rule</a>
             </span>
            )
}
});
