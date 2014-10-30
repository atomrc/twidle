/*global require, process*/

var http = require("https"),
    symbols = ("abcdefghijklmnopqrstuvwxyz").split(""),
    pattern = process.argv[2] || "",
    batchSize = 100, //the size of each name testing batch (the number of concurrent requests sent to twitter)
    availableNames = [], //all the available names the script will find
    request = {
        method: "HEAD",
        host: "twitter.com",
        path: "/thomasbelin4"
    },
    done = 0, //the number of requests done
    nbRequest = 0, //the number of requests sent

    /**
     * getResponseHandler - create the handle function 
     * called when a response is given by twitter
     * for a specific twitter handle
     *
     * @param {String} name - the twitter handle being requested
     * @return {void}
     */
    getResponseHandler = function (name) {
        "use strict";
        return function (response) {
            done++;
            response.destroy();
            if (response.statusCode !== 200 && response.statusCode !== 302) {
                availableNames.push(name);
            }
        };
    },

    /**
     * generateCombinaisons
     *
     * @param {Number} size - the size of the combinaison
     * @param {Number} index - the starting index
     * @param {Number} step - the number of combinaisons to generate
     * @return {Array} - the array of combinaisons
     */
    generateCombinaisons = function (size, index, step) {
        "use strict";
        var combinaisons = [];

        //do the cross product of all the symbols
        for (var i = index; i < index + step; i++) {
            var combinaison = [];
            for (var j = 0; j < size; j++) {
                combinaison[j] = symbols[Math.floor(i / Math.pow(symbols.length, j)) % symbols.length];
            }
            combinaisons.push(combinaison);
        }

        return combinaisons;
    },

    /**
     * runBatch - will run a single batch of twitter handles check
     *
     * @param {String} pattern - the handle pattern
     * @param {Number} index - the starting index of the batch
     * @param {Number} size - the size of the batch
     * @return {void}
     */
    runBatch = function (pattern, index, size) {
        "use strict";
        var varreg = /\./g,
            varsize = pattern.match(varreg).length;

        var combinaisons = generateCombinaisons(varsize, index, size);

        combinaisons.forEach(function (combinaison) {
            var placed = 0,
                name,
                req;

            name = pattern.replace(varreg, function () {
                placed++;
                return combinaison[placed - 1];
            });

            request.path = "/" + name;

            req = http.request(request, getResponseHandler(name));
            req.end();

            nbRequest++;
        });
    };

var variableSize = pattern.match(/\./g).length;
var totalSize = Math.pow(symbols.length, variableSize);

process.stdout.write("Good lord, there are " + totalSize + " twitter names to test ... here we go\n");
http.globalAgent.maxSockets = batchSize;

//here the magic happens
setInterval(function () {
    "use strict";
    var todo = Math.min(totalSize - done, batchSize);
    if (todo <= 0) {
        console.log(availableNames);
        process.kill();
    }
    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line
    process.stdout.write(done + "/" + totalSize + " (" + availableNames.length + " found)");
    if (done === nbRequest) {
        runBatch(pattern, totalSize - todo - done, todo);
    }
}, 100);
