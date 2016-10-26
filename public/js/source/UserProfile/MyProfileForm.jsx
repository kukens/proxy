var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({

        getInitialState: function () {

            $('#modal-window').modal('show');

            return {
                newPassword: '',
                oldPassword: '',
            };

        },

   handleNewPasswordChange: function (e) {
        this.setState({ newPassword: e.target.value });
    },

   handleOldPasswordChange: function (e) {
        this.setState({ oldPassword: e.target.value });
    },


    updateSettings: function (e) {
        var data = $(e.target).closest("form").serializeArray();

        $.ajax({
            type: "POST",
            url: "/user/my-profile",
            data: data,
            success: function (data) {
                $('#modal-window').modal('hide');
            }.bind(this)
        });
    },


    render: function () {

        return (
            <form id="modal-form">
                <div className="modal-header">
                    <h3>My profile settings</h3>
                </div>
                <div className="modal-body">
                    <fieldset>
                        <label>New Password:</label>
                        <input className="form-control" onChange={this.handleNewPasswordChange} type="password" name="newPassword" value={this.state.newPassword} />

                        <label>Current password:</label>
                        <input className="form-control" onChange={this.handleOldPasswordChange} type="password" name="oldPassword" value={this.state.oldPassword} />

                    </fieldset>
                </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button onClick={this.updateSettings} type="button" id="update-test-btn" className="btn btn-primary">Submit</button>
                    </div>
            </form>
                )
    }
});
