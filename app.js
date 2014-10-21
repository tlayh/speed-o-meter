/*global require*/
/*jslint node: true, nomen:true*/

/*
var GoPro = require('./lib/GoPro');
var gopro = new GoPro();
*/

var Sonic = require('./lib/Sonic');

var distance = 0;

console.log('Starting');
distance = Sonic.measureDistance(Sonic.alphaPins);

console.log(distance);

// gopro.setBurstMode();
// wait 3 seconds before taking a picture
/*
setTimeout(function() {
    gopro.takePicture();
}, 3000);
*/