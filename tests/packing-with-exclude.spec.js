var AssetsPack = require("../index.js");
var fs = require('fs');
var config = [
    {
        type: "js",
        source: "tests/data/js",
        destination: "tests/packed/myjslib.js",
        exclude: ["B.js", "C.js"],
        minify: true
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
                fs.readFile(__dirname + "/../tests/packed/myjslib.min.js", 'utf8', function(err, code) {
                    expect(code).not.toContain("C=");
                    expect(code).toContain("A=");
                    done();
                });
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