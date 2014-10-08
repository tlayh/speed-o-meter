/*global require*/
/*jslint node: true, nomen:true*/

var config = require('gopro_hero_api/config'),
        GoPro = require('gopro_hero_api/libs/gopro'),
        CameraMode = GoPro.CameraMode,
        camera = new GoPro('GoPro2377', config.ip, config.port);

// constructor
var GoPro = function() {

};

GoPro.prototype.turnOn = function() {
    camera.power(true).then(function() {
        console.log('Camera turned ON!!');
    }).catch(function(error) {
        console.log(error.message);
    });
};

GoPro.prototype.setBurstMode = function() {
    camera.setCameraMode(CameraMode.BURST).then(function() {
        console.log('Set camer to burst mode!!');
    }).catch(function() {
        console.log('Setting burst mode failed');
    });
};

GoPro.prototype.takePicture = function() {
    camera.ready().then(function() {

        camera.capture(true);
        console.log('Take pictures successful');

    }).catch(function(error) {
        console.log(error.message);
    });
};

GoPro.prototype.turnOff = function() {
    camera.power(false).then(function() {
        console.log('Camera turned OFF!!');
    }).catch(function(error) {
        console.log(error.message);
    });
};

GoPro.prototype.getLatestPicture = function() {
    console.log('fetch the last picture');
};

// export module
module.exports = GoPro;
