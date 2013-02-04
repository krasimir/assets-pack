var AssetsPack = require("../index.js");
var fs = require('fs');
var config = [
    {
        type: "js",
        source: "tests/data/js/",
        destination: "tests/packed/myjslib.js"
    }
]
var pack;

describe("Testing javascript packagement", function() {
    it("should have assetspack", function(done) {
        expect(AssetsPack).toBeDefined();
        done();
    });
    it("should start watching", function(done) {
        pack = new AssetsPack(config, function() {
            done();
        });
    })
    it("should compile the javascript", function(done) {
        pack.onPack(function(asset) {
            var fs = require('fs');
            fs.exists(__dirname + "/../" + config[0].destination, function(exists) {
              if (exists) {
                done();
              }
            });
        });
        var fs = require('fs');
        fs.appendFile(__dirname + "/data/js/lib/C.js", "\nvar currentTime = '" + (new Date().getTime()) + "';", function(err) {
            if(err) {
                console.log(err);
            }
        }); 
    })
});