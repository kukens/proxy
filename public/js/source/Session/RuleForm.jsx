var React = require('react');
var ReactDOM = require('react-dom');

var SessionActions = require('./SessionActions.jsx');

module.exports = React.createClass({

    deleteRule: function (e) {
        $.ajax({
            type: "DELETE",
            url: "/sessions/" + this.props.sessionId + '/rules/' + this.props.rule._id,
            success: ()=> {
                this.setState({ successMessage: 'Rule deleted sucessfully' });
                setTimeout(() => {
                    SessionActions.refresh();
                    $('#modal-window').modal('hide');
                }, 1000)
            },
            error: ()=> {
                this.setState({ errorMessage: 'Error ocurred' });
            }
        })
    },

    addRule: function (sessionId, data) {
        $.ajax({
            type: "POST",
            data: data,
            url: "/sessions/" + sessionId + '/rules',
            success: ()=> {
                this.setState({ successMessage: 'Rule added sucessfully' });
                setTimeout(() => {
                    SessionActions.refresh();
                    $('#modal-window').modal('hide');
                }, 1000)
            },
            error: ()=> {
                this.setState({ errorMessage: 'Error ocurred' });
        }
        });
    },

    updateRule: function (sessionId, ruleId, data) {
        $.ajax({
            type: "PUT",
            data: data,
            url: "/sessions/" + sessionId + '/rules/' + ruleId,
            success: ()=> {
                this.setState({ successMessage: 'Rule edited sucessfully' });
                setTimeout(() => {
                    SessionActions.refresh();
                    $('#modal-window').modal('hide');
                }, 1000)
            },
            error: ()=> {
                this.setState({ errorMessage: 'Error ocurred' });
            }
        })
    },

    submit: function (e) {
            var data = $(e.target).closest("form").serializeArray();

            if (this.props.rule.url)
            {
               this.updateRule(this.props.sessionId, this.props.rule._id, data);
            }
            else
            {
                this.addRule(this.props.sessionId, data);
            }
        },

    handleUrlChange: function (e) {
        this.setState({ url: e.target.value });
    },

    handleBodyChange: function (e) {
        this.setState({ body: e.target.value });
    },

    handleTTFBChange: function (e) {
        this.setState({ ttfb: e.target.value });
    },

    handleHeaderNameChange: function (index, e) {
        var headers = this.state.headers.slice();
        headers[index].name = e.target.value;
        this.setState({ headers: headers });
    },

    handleHeaderValueChange: function (index, e) {
        var headers = this.state.headers.slice();
        headers[index].value = e.target.value;
        this.setState({ headers: headers });
    },

    handleHeaderAdd: function () {
        this.setState({ headers: this.state.headers.concat([{ name: '', value: '' }]) });
    },

    handleHeaderRemove: function (value) {
        var headers = this.state.headers.slice();
        headers.splice(value, 1);
        this.setState({ headers: headers });
    },

    getInitialState: function () {
        return({
            url: this.props.rule.url ? this.props.rule.url : '',
            body: this.props.rule.body ? this.props.rule.body : '',
            ttfb: this.props.rule.ttfb ? this.props.rule.ttfb : '',
            headers: this.props.rule.headers ? this.props.rule.headers : [],
        })
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            url: nextProps.rule.url ? nextProps.rule.url : '',
            body: nextProps.rule.body ? nextProps.rule.body : '',
            ttfb: nextProps.rule.ttfb ? nextProps.rule.ttfb : '',
            headers: nextProps.rule.headers ? nextProps.rule.headers : [],
            successMessage: '',
            errorMessage: ''
        })
    },

    componentDidMount: function () {
        this._submitButton.disabled = !this._form.checkValidity();
    },

    componentDidUpdate: function (prevProps, prevState) {
        this._submitButton.disabled = !this._form.checkValidity();
    },


    render: function () {

        var headersList = this.state.headers.map(function (header, index) {
            return (

                 <div className="row" key={index}>
                <div className="col-xs-2">
                   <input onChange={this.handleHeaderNameChange.bind(null, index)} pattern="[-a-zA-z]*" required className="form-control" type="text" name={'headers[' + index + '][name]'} value={this.state.headers[index].name} />
                </div>
                <div className="col-xs-7">
                   <input onChange={this.handleHeaderValueChange.bind(null, index)} required className="form-control" type="text" name={'headers[' + index + '][value]'} value={this.state.headers[index].value} />
                </div>
               <div className="col-xs-3">
                  <button onClick={this.handleHeaderRemove.bind(null, index)} type="button" className="remove-header-btn btn btn-primary">Remove header</button>
               </div>
                 </div>
           );
        }.bind(this));


        var modalHeader, deleteRuleButton;

            if (this.props.rule.url) {
                modalHeader = 
                <div className="modal-header">
                     <h3>Edit rule</h3>
                     <p>Edit a rule of session '{this.props.sessionName}' (ID: {this.props.sessionId}).</p>
                 </div>

                deleteRuleButton = <button onClick={this.deleteRule} type="button" id="delete-rule-btn" className="btn btn-danger">Delete rule</button>
            } else {
                modalHeader = 
                    <div className="modal-header">
                      <h3>Add rule</h3>
                        <p>Add a rule to session '{this.props.sessionName}' (ID: {this.props.sessionId}).</p>
                     </div>
            };

        var message

        if (this.state.successMessage) {
            message = <div className="alert alert-success" role="alert">{this.state.successMessage}</div>
        } else if (this.state.errorMessage) {
            message = <div className="alert alert-warning" role="alert">{this.state.errorMessage}</div>
        }

        return (
             <form id="modal-form" ref={(c) => this._form = c}>
                {modalHeader}
                <div className="modal-body">
                <div className="form-group">
                <fieldset>
                    <label htmlFor="url">URL to match:</label>
                    <input onChange={this.handleUrlChange} pattern="http[s]?:\/\/.*?$|\/.*" required className="form-control" type="text" name="url" value={this.state.url} />

                    <label htmlFor="ttfb">TTFB to simulate (if blank then baseline values will be used):</label>
                    <input onChange={this.handleTTFBChange} pattern="\d*" className="form-control" type="text" name="ttfb" value={this.state.ttfb} />
                </fieldset>
                </div>
                     <div className="form-group headers">
                      <fieldset>
                         <label>Add/overwrite HTTP headers:</label>
                          {headersList}
                      </fieldset>
                      <button onClick={this.handleHeaderAdd} type="button" className="add-header-btn btn  btn-sm btn-primary m-t-5">Add header</button>
                     </div>

                <div className="form-group">
                <fieldset>
                    <label htmlFor="body">Overwrite HTTP body:</label>
                    <textarea onChange={this.handleBodyChange} className="form-control" name="body" rows="3" value={this.state.body} />
                </fieldset>
                </div>


                </div>
                  <div className="modal-footer">
                          {deleteRuleButton}
                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button onClick={this.submit} ref={(c) => this._submitButton = c} type="button" id="update-session-btn" className="btn btn-primary">Submit</button>
                  </div>
                  {message}
             </form>
        )
    }
});
