var React = require('react');
var Reflux = require('reflux');
var ReactDOM = require('react-dom');

var EditSessionLink = require('./EditSessionLink.jsx');
var RulesList = require('./RulesList.jsx');
var SessionStore = require('./SessionStore.jsx');
var SessionForm = require('./SessionForm.jsx');


module.exports = React.createClass({

    mixins: [Reflux.connect(SessionStore, "sessions")],



    getInitialState: function () {
        return({
            filterText:''
        })
    },

    renderSessionForm: function () {
        ReactDOM.render(
            <SessionForm sessionId={null} />, document.getElementById('modal-body')
        );
},

handleFilterTextChange: function (e) {
    this.setState({ filterText: e.target.value });
},


filter: function () {
    $.ajax({
        url: '/sessions?filter=' + this.state.filterText,
        dataType: 'json',
        success: (data)=> {
            this.setState({sessions:data})
        }
    });
},

clear: function () {
    $.ajax({
        url: '/sessions',
        dataType: 'json',
        success: (data)=> {
            this.setState({sessions:data})
        }
    });
},


getTestUrls: function () {
    $.ajax({
        url: '/sessions',
        dataType: 'json',
        success: (data)=> {
            this.setState({sessions:data})
        }
    });
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

            <div className="input-group">
                              <input list='urls' ref={(c) => this._filterInput = c} placeholder='All' onChange={this.handleFilterTextChange} className="form-control" type="text" name="filterText" value={this.state.filterText} />
                            <datalist id="urls">
                                  <option value="Python"/>
                                  <option value="C"/>
                                  <option value="C#" />
                                  <option value="C++" />
                            </datalist>
                            <div className="input-group-btn">
                                  <button onClick={this.clear} id="add-session-btn" type="button" className="btn btn-primary">
                                      Clear
                                   </button>
                                   <button onClick={this.filter} id="add-session-btn" type="button" className="btn btn-primary">
                                     Filter
                                  </button>

                </div>
            </div>

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