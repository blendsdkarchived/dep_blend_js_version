require('blend-class-system');
Blend.loadPath = __dirname + '/../src';

require(__dirname + '/../../../node_modules/blend-class-system/tests/testframework.js');
require(__dirname + '/10000-sanity.js');
require(__dirname + '/10000-commandline.js');

process.exit(BlendTest.run());
