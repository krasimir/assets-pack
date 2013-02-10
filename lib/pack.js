var encoding = 'utf-8';
var path = require('path');
var fs = require("fs");
var cleanCSS = require('clean-css');

module.exports = function() {
    return {
        onPackCallback: null,
        asset: null,
        css: function(files) {
            var content = files.map(function(file) {
                file = path.normalize(process.cwd() + '/' + file);
                return fs.readFileSync(file, encoding);
            });
            content = content.join('\n');
            if(this.asset.minify) content = cleanCSS.process(content);
            this.output(content);
        },
        def: function(files) {
            var content = files.map(function(file) {
                file = path.normalize(process.cwd() + '/' + file);
                return fs.readFileSync(file, encoding);
            });
            this.output(content.join('\n'));
        },
        output: function(content) {
            console.log("----- save: " + this.asset.output);
            fs.writeFileSync(process.cwd() + '/' + this.asset.output, content);
            if(this.onPackCallback) this.onPackCallback(this.asset.output);
        },
        packit: function(a, files, callback) {
            if(!Array.isArray(files)) files = [files];
            this.asset = a;
            this.onPackCallback = callback;
            (this[this.asset.type || "def"])(files);
        }
    }
}