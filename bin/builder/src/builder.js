#!/usr/bin/env node
require('blend-class-system');
var path = require('path');

Blend.loadPath = __dirname;

Blend.fixPath = function (pth) {
    return pth.replace(/\\/g, path.sep);
};

/**
 * Retuns the root folder of this package
 * @returns {string}
 */
Blend.getRootFolder = function (append) {
    var pth = __dirname + '/../../../' + (append || '');
    return path.resolve(Blend.fixPath(pth));
};

/**
 * Returns the path of BlendSDK sources files
 * @returns {string}
 */
Blend.getSDKFolder = function (append) {
    return Blend.getRootFolder('src/' + (append || ''));
};

/**
 * Returns the current package contents
 * @returns {string}
 */
Blend.getPackage = function () {
    var pth = Blend.getRootFolder() + '/package.json';
    return require(path.resolve(Blend.fixPath(pth)));
};

/**
 * Kickstart the builder
 */
var BuildApp = Blend.create('Builder.core.Main');
BuildApp.run();
