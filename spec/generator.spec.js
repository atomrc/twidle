var generator = require("../lib/generator");

describe("generate twitter handles from pattern", function () {
    it("should return the first name from the pattern", function () {
        var patterns = {
            ".": "a",
            "*": "a",
            "$": "b",
            "=": "0",
            ".=": "a0",
            "==": "00",
            ".*$=": "aab0"
        };

        for (var i in patterns) {
            expect(generator.generateNth(i, 0)).toBe(patterns[i]);
        }
    });

    it("should return the 7th name from the pattern", function () {
        var patterns = {
            ".": "g",
            "*": "a",
            "$": "j",
            "=": "6",
            ".=": "g0",
            "===": "600",
            ".*$=": "geb0"
        };

        for (var i in patterns) {
            expect(generator.generateNth(i, 6)).toBe(patterns[i]);
        }
    });
});
