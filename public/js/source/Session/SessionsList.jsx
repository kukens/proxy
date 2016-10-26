var React = require('react');
var Reflux = require('reflux');
var ReactDOM = require('react-dom');

var EditSessionLink = require('./EditSessionLink.jsx');
var RulesList = require('./RulesList.jsx');
var SessionStore = require('./SessionStore.jsx');
var SessionForm = require('./SessionForm.jsx');


module.exports = React.createClass({

    mixins: [Reflux.connect(SessionStore, "sessions")],

    renderSessionForm: function () {
        ReactDOM.render(
            <SessionForm sessionId={null} />, document.getElementById('modal-body')
        );
},

    render: function () {
        var sessionNodes = this.state.sessions.map(function (session) {
            return (
                        <li key={session._id}>
                              <EditSessionLink sessionId={session._id} sessionName={session.name} testUrl={session.testUrl} />
                              <RulesList session={session} />
                        </li>
                );
        }.bind(this));

        return (
            <div className="row">
               <div className="col-md-12" id="sessions">

            <div id="sessions-container">
                  <ul id="sessions-list">{sessionNodes}</ul>
            </div>
               </div>

                      <button onClick={this.renderSessionForm} id="add-session-btn" type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal-window">
                          Add session
                      </button>

               </div>
            );



    }
});