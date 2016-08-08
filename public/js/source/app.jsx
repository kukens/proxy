﻿
var ReactDOM = require('react-dom');
var React = require('react');

var PoliciesList = require('./PoliciesList.jsx');
var AddPolicyForm = require('./AddPolicyForm.jsx');


var MainContainer = React.createClass({

    renderAddPolicyForm: function () {
        ReactDOM.render(
            <AddPolicyForm />, document.getElementById('modal-body')
        );
    },

    render: function () {
     return (
      <div className="row">
            <div className="col-md-12" id="policies">

                <PoliciesList />
                 <button onClick={this.renderAddPolicyForm} id="add-policy-btn" type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#modal-window">
                     + Add policy
                 </button>
            </div>
         
      </div>
  );
    }
});


ReactDOM.render(
  <MainContainer />,
  document.getElementById('main-container')
);