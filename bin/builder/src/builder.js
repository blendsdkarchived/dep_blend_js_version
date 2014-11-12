#!/usr/bin/env node

require('blend-class-system');
var path = require('path');

Blend.loadPath = __dirname;

Blend.getSDKFolder = function () {
    var pth = __dirname + '/../../../src';
    return path.resolve(pth.replace(/\\/g, path.sep));
}

/**
 * Kickstart the builder
 */
var BuildApp = Blend.create('Builder.core.Main');
BuildApp.run();
