#Assets pack

--- 

The module is meant to be used in development mode. I.e. it is not a tool that you can add in production phase. It simply watches for changes in a specific directory and pack your assets.

## Features

- watches for changes
- perform packing/compilation of css, less and javascript
- minify the output if necessary
- execute shell command after packing

## Installation

    npm install assetspack

or

    npm install -g assetspack

## Usage

### Via the command line

    assetspack --config [path to json file]

### In code

    var AssetsPack = require("assetspack");
    var config = [
        {
            type: "css",
            source: "tests/data/css",
            destination: "tests/packed/styles.css"
        }
    ];
    var pack = new AssetsPack(config, function() {
        console.log("AssetsPack is watching");
    });
    pack.onPack(function() {
        console.log("AssetsPack did the job"); 
    })

## Configuration

The configuration is an array of objects. The object's properties are:

- type /required/ - css, less or js
- source /required/ - directory for watching (notice that there is no */* at the beginning and at the end of the path)
- destination /required/ - file, which will contain the output of the packing (notice that there is no */* at the beginning of the path)
- index /required/ /used only if type=less/ - your main less file
- minify /optional/ - if set to true the the css/js code is minified
- exclude /optional/ - array of files, which you don't want to be included (useful for css and javascript packing)
- hook /optional/ - a shell command for execution after packing

Example:

    [
        {
            "type": "css",
            "source": "tests/data/css",
            "destination": "tests/packed/styles.css"
        },
        {
            "type": "js",
            "source": "tests/data/js",
            "destination": "tests/packed/myjslib.js",
            "minify": true,
            "exclude": ["B.js", "C.js"]
        },
        {
            "type": "less",
            "source": "tests/data/less/",
            "index": "tests/data/less/index.less",
            "destination": "tests/packed/styles.less.css"
        }
    ]