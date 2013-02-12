var AssetsPack = require("../index.js");
var fs = require('fs');
var config = [
    {
        type: "less",
        watch: ["tests/data/less"],
        pack: "tests/data/less/index.less",
        output: "tests/packed/styles-less.css",
        minify: true
    }
]
var pack;

describe("Testing less packagement > ", function() {
    it("should have assetspack", function(done) {
        expect(AssetsPack).toBeDefined();
        done();
    });
    it("should start watching", function(done) {
        pack = new AssetsPack(config, function() {
            done();
        });
    })
    it("should compile the less", function(done) {
        pack.onPack(function(file) {
            var fs = require('fs');
            fs.exists(__dirname + "/../" + config[0].output, function(exists) {
              if (exists) {
                done();
              }
            });
        });
        var fs = require('fs');
        fs.appendFile(__dirname + "/data/less/addons/addon2.less", " ", function(err) {
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