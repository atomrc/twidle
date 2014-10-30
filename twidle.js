/*global require, process*/

var http = require("https"),
    generator = require("./lib/generator"),
    checker = require("./lib/checker");

var runBatch = function (pattern, index, size, callback) {
    "use strict";
    var name;
    for (var i = index; i < index + size; i++) {
        name = generator.generateNth(pattern, i);
        checker.checkName(name, callback);
    }
};

(function () {
    "use strict";
    var pattern = process.argv[2],
        availables = [],
        displayedNamesIndex = 0,
        batchSize = 100,
        totalSize = generator.getTotalCombinations(pattern),
        nbRequest = 0,
        done = 0;


    process.stdout.write("Good lord, there are " + totalSize + " twitter names to test ... here we go\n");
    http.globalAgent.maxSockets = batchSize;

    //here the magic happens
    setInterval(function () {
        process.stdout.clearLine();  // clear current text
        process.stdout.cursorTo(0);  // move cursor to beginning of line

        var todo = Math.min(totalSize - done, batchSize);
        if (todo <= 0) { process.kill(); }

        for (var i = displayedNamesIndex; i < availables.length; i++) {
            console.log(availables[i]);
        }

        displayedNamesIndex = availables.length;
        process.stdout.write(done + "/" + totalSize + " (\u001b[32m" + availables.length + "\u001b[39m found)");

        if (done === nbRequest) {
            runBatch(pattern, totalSize - todo - done, todo, function (name) { availables.push(name); });
            nbRequest = todo;
        }
    }, 100);
}());
