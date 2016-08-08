var React = require('react');
var ReactDOM = require('react-dom');

var EditPolicyForm = require('./EditPolicyForm.jsx');

module.exports = React.createClass({

    editPolicy: function(e){
        e.preventDefault();
            ReactDOM.render(
                    <EditPolicyForm policyName={this.props.policyName} policyId={this.props.policyId } />, document.getElementById('modal-body')
                );
        $('#modal-window').modal('show');

},
render: function () {
    return (
         <a className="edit-policy" onClick={this.editPolicy} data-toggle="modal" data-target="#modal-window" href="#">{this.props.policyId} - {this.props.policyName}</a>
            )
}
});
