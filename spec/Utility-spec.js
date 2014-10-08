var Utility = require('../lib/Utility');
var utility = new Utility();

describe("calculateDistance", function() {
    it ("should calculate a distance of sonic sound with two time values", function() {
        var startTime = 100;
        var stopTime = 105;
        var distance = utility.calculateDistance(startTime, stopTime);
        expect(distance).toBe(85750);
    });
});

describe("calculateSpeed", function() {
    it ("should calculate the speed out of timeframe and distance", function() {
        var timeStart = 100;
        var timeStop = 110;
        var distance = 0.3;
        var speed = utility.calculateSpeed(timeStart, timeStop, distance);
        expect(speed).toBe(108);
    })
});