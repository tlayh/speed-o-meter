/*global require*/

var gpio = require("pi-gpio");
var sleep = require("sleep");
var utility = require("./lib/Utility");

var alphaPins = {'trigger':18, 'echo':17};
var betaPins = {'trigger': 20, 'echo': 19};

// distance where the measurement should be start the timerecording, unit is centimeter
var triggerDistance = 150;
// distance between the two sonic devices, used for the speed caluclation, unit is meter
var sonicDistance = 0.3;

// constructor
var Sonic = function() {
    console.log('calling constructor');
};

Sonic.prototype.checkSpeed = function() {

    /**
     * state = 0 // waiting for activation
     * state = 1 // activated by Sonic Alpha
     * state = 2 // activated by Sonic Beta
     */
    var state = 0;
    var timerStart = 0;

    // measureDistance Sonic Alpha
    var distanceAlpha = this.measureDistance(alphaPins);

    // measureDistance Sonic Beta
    var distanceBeta = this.measureDistance(betaPins);

    // trigger timer for Sonic Alpha
    if (distanceAlpha < triggerDistance) {
        state = 1;
        timerStart = new Date().getTime();
    }
    // trigger timer for Sonic Beta
    if (distanceBeta < triggerDistance) {
        state = 2;
        timerStart = new Date().getTime();
    }

    if (state != 0) {
        var timerEnd = this.waitForStateToClear(state);
        var speed = utility.calculateSpeed(timerStart, timerEnd, sonicDistance);
    }

};

Sonic.prototype.waitForStateToClear = function(state) {

    while (state != 0) {
        // wait for Beta to be triggered, else wait for Alpha to be triggered
        if(state == 1) {

            // if Beta triggered

            state = 0;
            return new Date().getTime();

        } else if(state == 2) {

            // if Alpha triggered

            state = 0;
            return new Date().getTime();
        }
    }

};

Sonic.prototype.measureDistance = function(pinSet) {

    gpio.open(pinSet.trigger, "output", function(err) {     // open pin
        gpio.write(pinSet.trigger, 1, function() {          // set pin to high
            gpio.close(pinSet.trigger);                     // close pin
        })
    });

    // wait for 10µ seconds
    sleep.usleep(10);

    gpio.open(pinSet.trigger, "output", function(err) {     // open pin
        gpio.write(pinSet.trigger, 0, function() {          // set pin to low
            gpio.close(pinSet.trigger);                     // close pin
        })
    });

    // get current timestamp in milliseconds
    var startTime = new Date().getTime();
    var stopTime = new Date().getTime();

    while (this.checkEchoPin(pinSet) == false)
        startTime = new Date().getTime();

    while (this.checkEchoPin(pinSet) == true)
        stopTime = new Date().getTime();

    return utility.calculateDistance(startTime, stopTime);
};

// check for the response
Sonic.prototype.checkEchoPin = function(pinSet) {
    gpio.open(pinSet.echo, "output", function(err) {
        gpio.read(pinSet.echo, function(err, value) {
            gpio.close(pinSet.echo);
            return value == 1;
        })
    });
};


module.exports = Sonic;