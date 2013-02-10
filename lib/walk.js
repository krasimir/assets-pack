var fs = require("fs");
var _ = require('underscore');
var path = require('path');

module.exports = function(dir, type, callback, exclude) {

    var numOfDirs = 0;
    var files = [];
    var dirs = [];

    var readDir = function(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach(function(file) {
                file = dir + '/' + file;
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        readDir(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        });
                    } else {
                        if(path.extname(file).replace(".", "").toLowerCase() == type && _.indexOf(exclude, path.basename(file)) == -1) {
                            results.push(file);
                        }
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    }
    var readDirDone = function(err, f) {
        files = files.concat(f);
        if(++numOfDirs == dirs.length) {
            callback(files);
        }
    }

    if(!Array.isArray(dir)) {
        dirs = [dir];
    } else {
        dirs = dir;
    }

    for(var i=0; i<dirs.length; i++) {
        readDir(dirs[i], readDirDone);
    }

};