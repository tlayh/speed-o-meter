/*global require*/

// constructor
var Utility = function() {
    console.log('calling constructor');
};

Utility.prototype.calculateDistance = function(startTime, stopTime) {
    var timeElapsed = stopTime - startTime;
    // timeElapsed * sonic speed divided through 2 since we measure the way there and back
    return (timeElapsed * 34300) / 2;
};

Utility.prototype.calculateSpeed = function(timerStart, timerStop, distance) {
    // time difference in seconds
    var timeDifference = (timerStop - timerStart) / 1000;
    console.log(timeDifference);
    // speed in km/h
    return (distance / timeDifference) * 3.6;
};

module.exports = Utility;