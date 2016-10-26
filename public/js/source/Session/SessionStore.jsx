var Reflux = require('reflux');
var SessionActions = require('./SessionActions.jsx');

module.exports = Reflux.createStore({

    listenables: [SessionActions],

    getInitialState: function () {
        return []
    },

    init: function () {

        this.fetchSessions();
    },

    fetchSessions: function () {
        $.ajax({
            url: '/sessions',
            dataType: 'json',
            success: function (data) {
                this.trigger(data);
            }.bind(this)
        });
    },

    onRefresh: function (data) {
        this.fetchSessions();
    },
});
