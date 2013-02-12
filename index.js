#!/usr/bin/env node

var path = require('path');
var argv = require('optimist').argv;
var fs = require("fs");

require('shelljs/global');

module.exports = function(config, onReadyCallback, onPackCallback) {

    var self = this;
    var callbacks = {
        onReady: onReadyCallback,
        onPack: onPackCallback
    };

    var numOfAssets = 0;
    var numOfReadyAssets = 0;
    var assetWatchingStarted = function() {
        numOfReadyAssets += 1;
        if(numOfReadyAssets == numOfAssets) {
            if(callbacks.onReady) callbacks.onReady();
        }
    }

    if(typeof config.length === "undefined" || config.length === 0) throw new Error("Wrong configuration. Should be an array of objects.");
    numOfAssets = config.length;
    for(var i=0; i<numOfAssets; i++) {
        var asset = config[i];
        (function(asset) {
            var somethingChange = function() {
                require("./lib/walk")(asset.pack || asset.watch, asset.type, function(files) {
                    require("./lib/pack")().packit(asset, files, function(file) {
                        if(callbacks.onPack) callbacks.onPack(file);
                    });
                }, asset.exclude || []);
            }
            require("./lib/watch")(asset.watch, somethingChange, assetWatchingStarted);
            somethingChange();
        })(asset);
    }

    return {
        onReady: function(callback) {
            callbacks.onReady = callback;
            return self;
        },
        onPack: function(callback) {
            callbacks.onPack = callback;
            return self;
        }
    }

}

if(argv.config) {
    var c = require(process.cwd() + "/" + argv.config);
    new (module.exports)(c);
} else {
    var fs = require('fs');
    fs.exists(process.cwd() + "/assets.json", function(exists) {
        if (exists) {
            var c = require(process.cwd() + "/assets.json");
            new (module.exports)(c);
        } else {
            if(require.main === module) {
               throw new Error("There is no asset.js file in " + process.cwd() + ". Create this file or use --config [your json file] parameter.");
           }            
        }
    });
}