var path = require('path');
module.exports = function(dirsToWatch, callback, ready) {
    var watchedDirs = 0;
    if(!Array.isArray(dirsToWatch)) {
        dirsToWatch = [dirsToWatch];
    }
    for(var i=0; i<dirsToWatch.length; i++) {
        var pathToWatch = path.normalize(process.cwd() + "/" + dirsToWatch[i]);
        (function(dir) {
            var watch = {
                path: pathToWatch,
                listener: function(eventName, filePath, fileCurrentStat, filePreviousStat) { 
                    console.log(eventName + ": " + filePath.replace(process.cwd(), ""));
                    callback();
                },
                next: function(err, watcher){
                    if (err)  throw err;
                    console.log('watching: ' + dir);
                    watchedDirs += 1;
                    if(watchedDirs == dirsToWatch.length) {
                        ready();
                    }
                }
            };
            require('watchr').watch(watch);
        })(pathToWatch);     
    }
}