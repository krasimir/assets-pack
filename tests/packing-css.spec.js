var AssetsPack = require("../index.js");
var fs = require('fs');
var config = [
    {
        type: "css",
        watch: ["tests/data/css", "tests/data/css2"],
        pack: ["tests/data/css", "tests/data/css2"],
        output: "tests/packed/styles.css",
        minify: true,
        exclude: ["header.css"]
    }
]
var pack;

describe("Testing css packagement > ", function() {
    it("should have assetspack", function(done) {
        expect(AssetsPack).toBeDefined();
        done();
    });
    it("should start watching", function(done) {
        pack = new AssetsPack(config, function() {
            done();
        });
    })
    it("should compile the css", function(done) {
        pack.onPack(function(file) {
            var fs = require('fs');
            fs.exists(__dirname + "/../" + config[0].output, function(exists) {
              if (exists) {
                done();
              }
            });
        });
        var fs = require('fs');
        fs.appendFile(__dirname + "/data/css/mixin/mixin.css", " ", function(err) {
            if(err) {
                console.log(err);
            }
        }); 
    });
    it("should delete the file", function(done) {
        fs.unlink(__dirname + "/../" + config[0].output, function() {
            done();
        });
    });
});