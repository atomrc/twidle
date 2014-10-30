/*global module, require*/
var https = require("https");

(function (module) {
    "use strict";

    var request = {
        method: "HEAD",
        host: "twitter.com",
        path: ""
    };

    /**
     * getResponseHandler - create the handle function 
     * called when a response is given by twitter
     * for a specific twitter handle
     *
     * @param {String} name - the twitter handle being requested
     * @param {Function} callback - the success callback
     * @return {void}
     */
    var getResponseHandler = function (name, callback) {
        return function (response) {
            if (response.statusCode === 404) {
                callback(name);
            }
        };
    };

    module.exports = {
        checkName: function (name, callback) {
            request.path = "/" + name;
            var req = https.request(request, getResponseHandler(name, callback));
            req.end();
        }
    };
}(module));
