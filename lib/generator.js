/*global module*/
(function (module) {
    "use strict";

    var dictionaries = {
            ".": ("abcdefghijklmnopqrstuvwxyz").split(""), // all the alphabet
            "*": ("aeiouy").split(""),                     // the vowels
            "$": ("bcdfghjklmnpqrstvwxz").split(""),       // the consonants
            "=": ("0123456789").split("")                  // the numbers
        },

        dictsReg = /[=$*.]/g,

        getVariables = function getVariable(pattern) {
            return pattern.match(dictsReg);
        };

    module.exports = {
        getTotalCombinations: function (pattern) {
            var variables = getVariables(pattern),
                total = 1;

            for (var v in variables) {
                total = total * dictionaries[variables[v]].length;
            }
            return total;
        },

        /**
         * generateNth - generate the nth combination 
         * with the given pattern
         *
         * @param {String} pattern - the pattern of the name to generate
         * @param {Number} index - the index of the name to generate
         * @return {String} the name
         */
        generateNth: function (pattern, index) {
            var variables = getVariables(pattern),
                symbols,
                bindedVars = [],
                i;

            for (i in variables) {
                symbols = dictionaries[variables[i]];
                bindedVars.push(symbols[Math.floor(index / Math.pow(symbols.length, i)) % symbols.length]);
            }

            i = 0;
            return pattern.replace(dictsReg, function () {
                i++;
                return bindedVars[i - 1];
            });
        }
    };
}(module));
