var React = require('react');
var ReactDOM = require('react-dom');

var SessionForm = require('./SessionForm.jsx');

module.exports = React.createClass({

    editTest: function (e) {
        e.preventDefault();
        ReactDOM.render(
                    <SessionForm sessionName={this.props.sessionName} testUrl={this.props.testUrl} sessionId={this.props.sessionId } />, document.getElementById('modal-body')
                );
        $('#modal-window').modal('show');

    },
    render: function () {
        return (<div className='session-summary'>
           <strong>{this.props.sessionName}</strong> - {this.props.testUrl} -  <a className="edit-session" onClick={this.editTest} data-toggle="modal" data-target="#modal-window" href="#">Edit session</a>
        </div>)

}
});

