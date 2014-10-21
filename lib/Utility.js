/*global require*/

// constructor
var Utility = {};

Utility.calculateDistance = function(startTime, stopTime) {
    var timeElapsed = stopTime - startTime;
    // timeElapsed * sonic speed divided through 2 since we measure the way there and back
    return (timeElapsed * 34300) / 2;
};

Utility.calculateSpeed = function(timerStart, timerStop, distance) {
    // time difference in seconds
    var timeDifference = (timerStop - timerStart) / 1000;
    console.log(timeDifference);
    // speed in km/h
    return (distance / timeDifference) * 3.6;
};

module.exports = Utility;