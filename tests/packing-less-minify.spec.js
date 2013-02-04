var AssetsPack = require("../index.js");
var fs = require('fs');
var config = [
    {
        type: "less",
        source: "tests/data/less/",
        index: "tests/data/less/index.less",
        destination: "tests/packed/styles.less.css",
        minify: true
    }
]
var pack;

describe("Testing less packagement", function() {
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
        pack.onPack(function(asset) {
            var fs = require('fs');
            fs.exists(__dirname + "/../" + config[0].destination, function(exists) {
              if (exists) {
                done();
              }
            });
        });
        var fs = require('fs');
        fs.appendFile(__dirname + "/data/less/addons/addon.less", " ", function(err) {
            if(err) {
                console.log(err);
            }
        }); 
    })
});