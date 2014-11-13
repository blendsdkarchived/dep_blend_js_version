#!/usr/bin/env node
require('blend-class-system');
var path = require('path');

Blend.loadPath = __dirname;

/**
 * Returns the path of BlendSDK sources files
 * @returns {unresolved}
 */
Blend.getSDKFolder = function () {
    var pth = __dirname + '/../../../src';
    return path.resolve(pth.replace(/\\/g, path.sep));
}

/**
 * Returns the current package contents
 * @returns {unresolved}
 */
Blend.getPackage = function () {
    var pth = __dirname + '/../../../package.json';
    return require(path.resolve(pth.replace(/\\/g, path.sep)));
}

/**
 * Kickstart the builder
 */
var BuildApp = Blend.create('Builder.core.Main');
BuildApp.run();
