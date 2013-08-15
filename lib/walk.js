var fs = require("fs");
var _ = require('underscore');
var path = require('path');

module.exports = function(dir, type, callback, exclude) {

    var numOfDirs = 0;
    var files = [];
    var dirs = [];

    var readDir = function(dir, done) {
        var results = [];
        function addFile (file){
           if(path.extname(file).replace(".", "").toLowerCase() === type && _.indexOf(exclude, path.basename(file)) === -1) {
             results.push(file);
           }
        }
        fs.stat(dir, function(err, stat) {
            if (err) {
              console.log('NOT FOUND: ' + dir + ' Please check your config!');
              done(null,[]);
            }
            else if (stat && stat.isDirectory()) {
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
                                addFile(file);
                                if (!--pending) done(null, results);
                            }
                        });
                    });
                });
            } else {
              addFile(dir);
              done(null, results);        
            }
        });
    };

    var readDirDone = function(err, f) {
        files = files.concat(f);
        if(++numOfDirs === dirs.length) {
            files.sort();
            callback(files);
        }
    };
    
    if(!Array.isArray(dir)) {
        dirs = [dir];
    } else {
        dirs = dir;
    }

    for(var i=0; i<dirs.length; i++) {
        readDir(dirs[i], readDirDone);
    }
    
};