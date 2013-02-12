#Assets pack

--- 

The module is meant to be used in development mode. I.e. it is not a tool that you can add in production phase. It simply watches for changes in a specific directory and pack your assets.

## Features

- watches for changes
- perform packing/compilation of css, less, javascript or whatever you want
- minify the output if necessary
- exclude files

## Installation

    npm install assetspack

or globally:

    npm install -g assetspack

## Usage
The module's configuration works with json configuration. When it is used via the command like you should place your settings in *.json* file.

### Via the command line
Create *assets.json* file and execute the following command in the same directory

    assetspack

If your configuration file is with another name or it is just in another directory use

    assetspack --config [path to json file]

### In code

    var AssetsPack = require("assetspack");
    var config = [
        {
            type: "css",
            watch: ["css/src"],
            output: "tests/packed/styles.css",
            minify: true,
            exclude: ["custom.css"]
        }
    ];
    var pack = new AssetsPack(config, function() {
        console.log("AssetsPack is watching");
    });
    pack.onPack(function() {
        console.log("AssetsPack did the job"); 
    });

## Configuration
The configuration should be a valid json file/object. An array of objects:

    [
        (asset object),
        (asset object),
        (asset object),
        ...
    ]

## Asset Object

The basic structure of the asset object is:

    {
        type: (file type /string, could be css, js or less for example),
        watch: (directory or directories for watching /string or array of strings/),
        pack: (directory or directories for packing /string or array of strings/. ),
        output: (path to output file /string/),
        minify: /boolean/,
        exclude: (array of file names)
    }

The *pack* property is not mandatory. If you miss it then its value is equal to *watch*. *minify* by defualt is false.

Here are few examples:

### Packing CSS

    {
        type: "css",
        watch: ["tests/data/css", "tests/data/css2"],
        pack: ["tests/data/css", "tests/data/css2"],
        output: "tests/packed/styles.css",
        minify: true,
        exclude: ["header.css"]
    }

### Packing JavaScript

    {
        type: "js",
        watch: "tests/data/js",
        pack: ["tests/data/js"],
        output: "tests/packed/scripts.js",
        minify: true,
        exclude: ["A.js"]
    }

### Packing less
The packing of .less files is a little bit different. *pack* property is mandatory and it is basically your entry point. You should import all the others less files there. The *exclude*  is not available here. 

    {
        type: "less",
        watch: ["tests/data/less"],
        pack: "tests/data/less/index.less",
        output: "tests/packed/styles-less.css",
        minify: true
    }

If you find any problem, please check the *tests/packing-less.spec.js*.

### Packing other file formats
*assets-pack* works with any file format. For example we can combine html templates into a single file:

    {
        type: "html",
        watch: ["tests/data/tpl"],
        output: "tests/packed/template.html",
        exclude: ["admin.html"]
    }

The only one thing that you should know here is that there is no minification.
