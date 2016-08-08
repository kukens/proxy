var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({

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
        return {
            headers: this.props.headers ? this.props.headers : []
        }
    },

    render: function () {

        var headersList = this.state.headers.map(function (header, index) {
            return (

                 <div className="row" key={index}>
                 <div className="col-xs-2">
                    <input onChange={this.handleHeaderNameChange.bind(null, index)} className="form-control" type="text" name={'headers[' + index + '][name]'} value={this.state.headers[index].name} />
                 </div>
                 <div className="col-xs-7">
                    <input onChange={this.handleHeaderValueChange.bind(null, index)} className="form-control" type="text" name={'headers[' + index + '][value]'} value={this.state.headers[index].value} />
                 </div>
                <div className="col-xs-3">
                   <button onClick={this.handleHeaderRemove.bind(null, index)} type="button" className="remove-header-btn btn btn-primary">- Remove header</button>
                </div>
                 </div>
           );
        }.bind(this));


        return (
            <div className="form-group headers">
                 <fieldset>
                     <label>Add/overwrite HTTP headers:</label>
                    {headersList}
                    
                 </fieldset>
                <button onClick={this.handleHeaderAdd} type="button" className="add-header-btn btn btn-primary m-t-5">+ Add header</button>
                 </div>

                )
    }
});
