/**
 * Require utility packages
 * @type type
 */
var fs = require('fs');
var path = require('path');

Blend.defineClass('Builder.utils.Resources', {
    singleton: true,
    root: null,
    init: function () {
        var me = this;
        me.root = path.resolve(__dirname + '/../../');
    },
    getUsage: function () {
        var me = this;
        return me.readFile('Builder/resources/usage.txt');
    },
    readFile: function (filename) {
        var me = this;
        return fs.readFileSync(path.resolve(me.root + '/' + filename)).toString();
    }
});

