require('blend-class-system');
var path = require('path');
Blend.loadPath = __dirname;

Blend.getSDKFolder = function () {
    return __dirname + '/../node_modules/blendsdk'
}

/**
 * Kickstart the builder
 */
var BuildApp = Blend.create('Builder.core.Main');
BuildApp.run();
