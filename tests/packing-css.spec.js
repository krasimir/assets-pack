var AssetsPack = require("../index.js");
var fs = require('fs');
var config = [
    {
        type: "css",
        source: "tests/data/css",
        destination: "tests/packed/styles.css"
    }
]
var pack;

describe("Testing css packagement", function() {
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
        pack.onPack(function(asset) {
            var fs = require('fs');
            fs.exists(__dirname + "/../" + config[0].destination, function(exists) {
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
    })
});