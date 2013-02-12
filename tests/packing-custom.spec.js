var AssetsPack = require("../index.js");
var fs = require('fs');
var config = [
    {
        type: "html",
        watch: ["tests/data/tpl"],
        output: "tests/packed/template.html",
        exclude: ["admin.html"]
    }
]
var pack;

describe("Testing custom packagement > ", function() {
    it("should have assetspack", function(done) {
        expect(AssetsPack).toBeDefined();
        done();
    });
    it("should start watching", function(done) {
        pack = new AssetsPack(config, function() {
            done();
        });
    })
    it("should compile the custom", function(done) {
        pack.onPack(function(file) {
            var fs = require('fs');
            fs.exists(__dirname + "/../" + config[0].output, function(exists) {
              if (exists) {
                done();
              }
            });
        });
        var fs = require('fs');
        fs.appendFile(__dirname + "/data/tpl/admin.html", " ", function(err) {
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