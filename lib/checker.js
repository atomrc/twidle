/*global module, require*/
var https = require("https");

(function (module) {
    "use strict";

    var request = {
        method: "HEAD",
        host: "twitter.com",
        path: ""
    };

    module.exports = {

        setBatchSize: function (size) {
            https.globalAgent.maxSockets = size;
        },

        checkName: function (name, callback) {
            request.path = "/" + name;
            var req = https.request(request, function (response) {
                if (response.statusCode === 404) {
                    return callback(name);
                }
                callback(null);
                response.destroy();
            });
            req.end();
        }
    };
}(module));
