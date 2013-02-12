var encoding = 'utf-8';
var path = require('path');
var fs = require("fs");
var cleanCSS = require('clean-css');
var less = require("less");

module.exports = function() {
    return {
        onPackCallback: null,
        asset: null,
        css: function(files) {
            var content = this.mergeFiles(files);
            if(this.asset.minify) content = cleanCSS.process(content);
            this.output(content);
        },
        js: function(files) {
            var content = this.mergeFiles(files);
            if(this.asset.minify) {
                var jsp = require("uglify-js").parser;
                var pro = require("uglify-js").uglify;
                var ast = jsp.parse(content); // parse code and get the initial AST
                ast = pro.ast_mangle(ast); // get a new AST with mangled names
                ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
                content = pro.gen_code(ast); // compressed code here
            }
            this.output(content);
        },
        less: function() {
            var lessConfig = {},
                self = this;
            fs.readFile(process.cwd() + "/" + this.asset.pack, 'utf8', function(err, indexless) {
                if(err) throw err;
                var parser = new(less.Parser)({ 
                    paths: [process.cwd() +"/" + self.asset.watch],
                    rootpath: process.cwd() + "/" + path.dirname(self.asset.pack),
                    relativeUrls: false,
                    strictImports: false
                });
                parser.parse(indexless, function (err, tree) {
                    if (err) throw err;
                    content = tree.toCSS({
                        compress: self.asset.minify,
                        yuicompress: self.asset.minify
                    });
                    self.output(content);
                });
            });
        },
        def: function(files) {
            var content = this.mergeFiles(files);
            this.output(content);
        },
        mergeFiles: function(files) {
            var content = files.map(function(file) {
                file = path.normalize(process.cwd() + '/' + file);
                return fs.readFileSync(file, encoding);
            });
            content = content.join('\n');
            return content;
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
            if(this[this.asset.type]) {
                this[this.asset.type](files);
            } else {
                this.def(files);
            }
        }
    }
}