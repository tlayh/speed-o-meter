/*global require*/

var gpio = require("pi-gpio");
var sleep = require("sleep");
var utility = require("./Utility");


var Sonic = {};

Sonic.alphaPins = {'trigger':24, 'echo':23};
Sonic.betaPins = {'trigger': 20, 'echo': 19};

// distance where the measurement should be start the timerecording, unit is centimeter
Sonic.triggerDistance = 150;
// distance between the two sonic devices, used for the speed caluclation, unit is meter
Sonic.sonicDistance = 0.3;


Sonic.checkSpeed = function() {

    /**
     * state = 0 // waiting for activation
     * state = 1 // activated by Sonic Alpha
     * state = 2 // activated by Sonic Beta
     */
    var state = 0;
    var timerStart = 0;

    // measureDistance Sonic Alpha
    var distanceAlpha = this.measureDistance(Sonic.alphaPins);

    // measureDistance Sonic Beta
    var distanceBeta = this.measureDistance(Sonic.betaPins);

    // trigger timer for Sonic Alpha
    if (distanceAlpha < Sonic.triggerDistance) {
        state = 1;
        timerStart = new Date().getTime();
    }
    // trigger timer for Sonic Beta
    if (distanceBeta < Sonic.triggerDistance) {
        state = 2;
        timerStart = new Date().getTime();
    }

    if (state != 0) {
        var timerEnd = this.waitForStateToClear(state);
        var speed = utility.calculateSpeed(timerStart, timerEnd, Sonic.sonicDistance);
    }

};

Sonic.waitForStateToClear = function(state) {

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

Sonic.measureDistance = function(pinSet) {

    console.log('Start distance measure with pinSet: ' + pinSet);

    gpio.open(pinSet.trigger, "output", function(err) {     // open pin
        gpio.write(pinSet.trigger, 1, function() {          // set pin to high
            gpio.close(pinSet.trigger);                     // close pin

            // wait for 10µ seconds
            sleep.usleep(10);

            gpio.open(pinSet.trigger, "output", function(err) {     // open pin
                gpio.write(pinSet.trigger, 0, function() {          // set pin to low
                    gpio.close(pinSet.trigger);                     // close pin

                    // get current timestamp in milliseconds
                    var startTime = new Date().getTime();
                    var stopTime = new Date().getTime();

                    while(Sonic.checkEchoPin(pinSet) == false) {
                        startTime = new Date().getTime();
                    }

                    while(Sonic.checkEchoPin(pinSet) == true) {
                        stopTime = new Date().getTime();
                    }

                    return utility.calculateDistance(startTime, stopTime);
                })
            });
        })
    });
};

// check for the response
Sonic.checkEchoPin = function(pinSet) {
    var result = false;
    gpio.open(pinSet.echo, "input", function(err) {
        gpio.read(pinSet.echo, function(err, value) {
            gpio.close(pinSet.echo);
            result = value == 1;
        })
    });
    return result;
};


module.exports = Sonic;