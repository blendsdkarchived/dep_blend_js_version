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
                console.log('OK');
            } else {
                console.log('NO OK');
            }
        }
        return true;
    }
});

