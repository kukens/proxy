var Reflux = require('reflux');
var PoliciesActions = require('./PoliciesActions.jsx');


module.exports = Reflux.createStore({
    listenables: [PoliciesActions],
    init: function () {
        this.fetchPolicies();
    },

    getInitialState: function () {
        return []
    },

    fetchPolicies: function () {
        $.ajax({
            url: '/policies',
            dataType: 'json',
            success: function (data) {
                this.trigger(data);
                console.log('policies fetched');
            }.bind(this)
        });
    },



    onAddPolicy: function (data) {
        $.ajax({
            type: "POST",
            url: "/policies",
            data: data,
            success: function (data) {
                this.fetchPolicies();
                $('#modal-window').modal('hide');
            }.bind(this)
        });
    },

    onDeletePolicy: function (policyId) {
        $.ajax({
            type: "DELETE",
            url: "/policies/" + policyId,
            success: function () {
                this.fetchPolicies();
                $('#modal-window').modal('hide');
            }.bind(this)
        });
    },

    onUpdatePolicy: function (policyId, data) {
        $.ajax({
            type: "POST",
            data: data,
            url: "/policies/" + policyId,
            success: function () {
                this.fetchPolicies();
                $('#modal-window').modal('hide');
            }.bind(this)
        });
    },

    onAddProperty: function (policyId, data) {
        $.ajax({
            type: "POST",
            data: data,
            url: "/policies/" + policyId + '/properties',
            success: function (data) {
                this.fetchPolicies();
                $('#modal-window').modal('hide');
            }.bind(this)
        });
    },

    onDeleteProperty: function (policyId, propertyId) {
        $.ajax({
            type: "DELETE",
            url: "/policies/" + policyId + '/properties/' + propertyId,
            success: function () {
                this.fetchPolicies();
                $('#modal-window').modal('hide');
            }.bind(this)
        });
    },

    onUpdateProperty: function (policyId, propertyId, data) {
        $.ajax({
            type: "POST",
            data: data,
            url: "/policies/" + policyId + '/properties/' + propertyId,
            success: function (data) {
                this.fetchPolicies();
                $('#modal-window').modal('hide');
            }.bind(this)
        });
    },


});
