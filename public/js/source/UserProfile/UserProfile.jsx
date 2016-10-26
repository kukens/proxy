var React = require('react');
var ReactDOM = require('react-dom');
var AdminSettingsForm = require('./AdminSettingsForm.jsx');
var MyProfileForm = require('./MyProfileForm.jsx');

module.exports = React.createClass({

    componentWillMount: function () {
        $.ajax({
            type: "GET",
            url: "/user",
            success: function (data) {
                this.setState({ name: data.user, role: data.role });
            }.bind(this)
        });
    },

    getInitialState: function () {
        return { name: '', isAdmin: false };
    },

    renderAdminSettingsForm: function () {
        ReactDOM.render(
            <AdminSettingsForm />, document.getElementById('modal-body')
        );
    },


    renderMyProfileForm: function () {
        ReactDOM.render(
            <MyProfileForm />, document.getElementById('modal-body')
        );
    },

    render: function () {

        var adminLink;
        if (this.state.role == 'admin') {
            adminLink = <a href='#' onClick={this.renderAdminSettingsForm} data-toggle="modal" data-target="#modal-window">Admin settings</a>;
        }

        var myProfileLink = <a href='#' onClick={this.renderMyProfileForm} data-toggle="modal" data-target="#modal-window">My profile</a>
        var logoutLink = <a href='/user/log-out'>Logout</a>

        return (
              <div className="row user-profile">
            <div className="col-md-2">
               <h4>WPT Proxy </h4>
            </div>
                    <div className="col-md-10">
                <span className='logged-as'>{this.state.name}</span><span className='my-profile-links'>{myProfileLink}{adminLink} | {logoutLink}</span>
                    </div>
              </div>
                )
    }
});
