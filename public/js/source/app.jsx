
var ReactDOM = require('react-dom');
var React = require('react');

var SessionsList = require('./Session/SessionsList.jsx');
var UserProfile = require('./UserProfile/UserProfile.jsx');

var MainContainer = React.createClass({



    render: function(){
        return (
        <div>
          <UserProfile />
          <SessionsList />
        </div>);
    }
});

ReactDOM.render(
  <MainContainer />,
  document.getElementById('main-container')
);
