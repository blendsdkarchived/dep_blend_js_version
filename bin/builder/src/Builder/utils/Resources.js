/**
 * Utility class for reading package resources
 */
Blend.defineClass('Builder.utils.Resources', {
    requires: [
        'Builder.utils.FileUtils'
    ],
    singleton: true,
    root: null,
    init: function () {
        var me = this;
        me.root = FileUtils.resolve(__dirname + '/../../');
    },
    getUsage: function () {
        var me = this;
        return me.readFile('Builder/resources/usage.txt');
    },
    readFile: function (filename) {
        var me = this;
        return FileUtils.readFile(Blend.fixPath(FileUtils.resolve(me.root + '/' + filename))).toString();
    }
});

