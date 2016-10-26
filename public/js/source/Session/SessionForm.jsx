var React = require('react');
var ReactDOM = require('react-dom');

var SessionsList = require('./SessionsList.jsx');
var SessionActions = require('./SessionActions.jsx');

module.exports = React.createClass({

    deleteTest: function (e) {
        $.ajax({
            type: "DELETE",
            url: "/sessions/" + this.props.sessionId,
            success: () => {
                this.setState({ successMessage: 'Session deleted sucessfully' });
                setTimeout(() => {
                    SessionActions.refresh();
                    $('#modal-window').modal('hide');
                }, 1000)
            },
            error: () => {
                this.setState({ errorMessage: 'Error ocurred' });
            }
        });
    },

    addSession: function (data) {
        $.ajax({
            type: "POST",
            url: "/sessions",
            data: data,
            success: () => {
                this.setState({ successMessage: 'Session added sucessfully' });
                setTimeout(() => {
                    SessionActions.refresh();
                    $('#modal-window').modal('hide');
                }, 1000)
            },
            error: () => {
                this.setState({ errorMessage: 'Error ocurred' });
            }
        });
    },

    updateSession: function (sessionId, data) {
        $.ajax({
            type: "PUT",
            data: data,
            url: "/sessions/" + sessionId,
            success: () => {
                this.setState({ successMessage: 'Session updated sucessfully' });
                setTimeout(() => {
                    SessionActions.refresh();
                    $('#modal-window').modal('hide');
                }, 1000)
            },
            error: () => {
                this.setState({ errorMessage: 'Error ocurred' });
            }
        });
    },


    submit: function (e) {

        if (this.props.sessionId) {
            var data = $(e.target).closest("form").serializeArray();
            this.updateSession(this.props.sessionId, data);
        }
        else
        {
            var data = $(e.target).closest("form").serializeArray();
            this.addSession(data);
        }
    },

    handleNameChange: function (e) {
        this.setState({ name: e.target.value });
    },

     handleTestUrlChange: function (e) {
        this.setState({ testUrl: e.target.value });
    },

     getInitialState: function () {
        return {
            name: this.props.sessionName? this.props.sessionName : '',
            testUrl: this.props.testUrl ? this.props.testUrl : '',
        };
     },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            name: nextProps.sessionName ? nextProps.sessionName : '',
            testUrl: nextProps.testUrl ? nextProps.testUrl : '',
            successMessage: '',
            errorMessage: '',
        });
    },

    componentDidMount: function () {
        this._submitButton.disabled = !this._form.checkValidity();
    },

    componentDidUpdate: function (prevProps, prevState) {
        this._submitButton.disabled = !this._form.checkValidity();
    },


    render: function () {

        var modalHeader, deleteTestButton;

        if (this.props.sessionId) {
            modalHeader = 
                 <div className="modal-header">
                      <h3>Edit session</h3>
                       <p>Edit session '{this.props.sessionName}' (ID: {this.props.sessionId}). </p>
                 </div>

            deleteTestButton = <button onClick={this.deleteTest} type="button" id="delete-rule-btn" className="btn btn-danger">Delete session</button>
        } else {
            modalHeader = 
                 <div className="modal-header">
                        <h3>Add session</h3>
                        <p>Create a brand new session.</p>
                 </div>
        };

        var message

        if (this.state.successMessage) {
            var message = <div className="alert alert-success" role="alert">{this.state.successMessage}</div>
        } else if (this.state.errorMessage) {
            var message = <div className="alert alert-warning" role="alert">{this.state.errorMessage}</div>
        }

        return (
            <form id="modal-form" ref={(c) => this._form = c}>
               {modalHeader}
                <div className="modal-body">
                    <fieldset>
                        <label htmlFor="alias">Test name:</label>
                        <input className="form-control" required onChange={this.handleNameChange} id="alias" type="text" name="name" value={this.state.name} />

                        <label htmlFor="testUrl">Test URL:</label>
                        <input className="form-control" required pattern="http[s]?:\/\/.*?$|\/.*" onChange={this.handleTestUrlChange} id="sessionUrl" type="text" name="testUrl" value={this.state.testUrl} />
                    </fieldset>
                </div>

                    <div className="modal-footer">
                       {deleteTestButton}
                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button onClick={this.submit} ref={(c) => this._submitButton = c} type="button" id="update-session-btn" className="btn btn-primary">Submit</button>
                    </div>
                {message}
            </form>
                )
    }
});
