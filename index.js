#!/usr/bin/env node

var path = require('path');
var argv = require('optimist').argv;
var buildify = require('buildify');
var less = require("less");
var fs = require("fs");

require('shelljs/global');

module.exports = function(config, onReadyCallback, onPackCallback) {

    var self = this;
    var callbacks = {
        onReady: onReadyCallback,
        onPack: onPackCallback
    };

    var onReady = function(callback) {
        callbacks.onReady = callback;
    }
    var onPack = function(callback) {
        callbacks.onPack = callback;
        return self;
    }
    var pack = function(asset, pathToWatch, destinationFile) {

        // less compilation
        if(asset.type == "less") {
            var lessConfig = {}
            fs.readFile(process.cwd() + "/" + asset.index, 'utf8', function(err, indexless) {
                if(err) throw err;
                var parser = new(less.Parser)({ 
                    paths: [pathToWatch],
                    rootpath: pathToWatch,
                    relativeUrls: false,
                    strictImports: false
                });
                parser.parse(indexless, function (err, tree) {
                    if (err) throw err;
                    var result = tree.toCSS({
                        compress: asset.minify,
                        yuicompress: asset.minify
                    });
                    if(asset.minify) {
                        var dir = path.dirname(destinationFile);
                        var file = path.basename(destinationFile).replace(".css", ".min.css");
                        fs.writeFileSync(process.cwd() + "/" + dir + "/" + file, result, 'utf8');
                    } else {
                        fs.writeFileSync(process.cwd() + "/" + asset.destination, result, 'utf8');
                    }
                    fs.writeFileSync(process.cwd() + "/" + asset.destination, result, 'utf8');
                    console.log(process.cwd() + "/" + asset.destination);
                    if (asset.hook) exec(asset.hook);
                    if (callbacks.onPack) callbacks.onPack(asset);
                });
            });

        // css and javascript packing
        } else {
            walk(pathToWatch, function(err, files) {
                var filesToConcat = [];
                for(var j=0; j<files.length; j++) {
                    var add = true;
                    if(path.extname(files[j]).toLowerCase() !== "." + asset.type) {
                        add = false;
                    }
                    if(add && asset.exclude) {
                        for(var n=0; n<asset.exclude.length; n++) {
                            if(path.basename(files[j]) == asset.exclude[n]) {
                                add = false;
                            }
                        }
                    }
                    if(add) filesToConcat.push(files[j].replace(pathToWatch + "/", ""));
                }
                var b = buildify(pathToWatch)
                .concat(filesToConcat)
                .setDir(process.cwd());
                if(asset.type == "js") {
                    if(asset.minify) {
                        var dir = path.dirname(destinationFile);
                        var file = path.basename(destinationFile).replace(".js", ".min.js");
                        b.uglify().save(dir + "/" + file);
                    } else {
                        b.save(destinationFile);
                    }
                } else if(asset.type == "css") {
                    if(asset.minify) {
                        var dir = path.dirname(destinationFile);
                        var file = path.basename(destinationFile).replace(".css", ".min.css");
                        b.cssmin().save(dir + "/" + file);
                    } else {
                        b.save(destinationFile);
                    }
                }
                if (asset.hook) exec(asset.hook);
                if (callbacks.onPack) callbacks.onPack(asset);
            });
        }
    }
    var walk = function(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach(function(file) {
                file = dir + '/' + file;
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        });
                    } else {
                        results.push(file);
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    };

    if(typeof config.length === "undefined" || config.length === 0) throw new Error("Wrong configuration. Should be an array of objects.");
    for(var i=0; i<config.length; i++) {
        var asset = config[i];
        (function(asset) {
            var pathToWatch = path.normalize(process.cwd() + "/" + asset.source);
            var destinationFile = asset.destination;
            var watch = {
                path: pathToWatch,
                listener: function(eventName, filePath, fileCurrentStat, filePreviousStat) { 
                    pack(asset, pathToWatch, destinationFile);
                },
                next: function(err, watcher){
                    if (err)  throw err;
                    if (callbacks.onReady) callbacks.onReady(asset);
                    console.log('watching in ' + pathToWatch);
                }
            };
            require('watchr').watch(watch);
        })(asset);
    }

    return {
        onReady: onReady,
        onPack: onPack
    }

}

if(argv.config) {
    var c = require(process.cwd() + "/" + argv.config);
    new (module.exports)(c);
}