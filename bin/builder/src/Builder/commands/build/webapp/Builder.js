var fs = require('fs');
Blend.defineClass('Builder.commands.build.webapp.Builder', {
    extend: 'Builder.commands.build.Base',
    runInternal: function () {
        var me = this, files = [], jsfiles, numFiles,
                numJsFiles;
        me.initFileCache();
        me.initDepAnalyzer();

        files = me.cache.update();
        numFiles = Object.keys(files).length;

        if (numFiles !== 0) {
            /**
             * Some files have been updated
             */
            jsfiles = me.cache.getJSFiles();
            numJsFiles = Object.keys(jsfiles).length;

            if (numJsFiles !== 0) {
                if (me.depAnalyzer.analyze(files)) {
                    me.depMap = me.depAnalyzer.getDependencyMap();
                } else {
                    console.error('Unable to build this application due previous errors!');
                }
            }
        }
        return true;
    }
});

