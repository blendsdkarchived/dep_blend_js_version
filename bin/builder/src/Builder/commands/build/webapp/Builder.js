var fs = require('fs');
Blend.defineClass('Builder.commands.build.webapp.Builder', {
    extend: 'Builder.commands.build.Base',
    runInternal: function () {
        var me = this, files = [], numFiles;
        if (!me.cache) {
            me.cache = Blend.create('Builder.cache.Cache', {
                root: [me.projectFolder],
                exts: ['.xml', '.ms', me.getIndexTemplateExtension()]
            });
        }
        me.createDepAnalyzer();
        files = me.cache.update();
        numFiles = Object.keys(files).length;
        if (numFiles !== 0) {
            if (me.depAnalyzer.analyze(files)) {
                /**
                 * We start generating files and building the application is
                 * analyze when without errors.
                 */
            } else {
                console.error('Unable to build this application due previous errors!');
            }
        }
        return true;
    }
});

