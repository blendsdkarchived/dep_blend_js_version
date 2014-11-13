var fs = require('fs');
Blend.defineClass('Builder.commands.build.webapp.Builder', {
    extend: 'Builder.commands.build.Base',
    runInternal: function () {
        var me = this, files = [], jsfiles, numFiles,
                numJsFiles, analyzeOk = null, depList;
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
                    //depList = me.depAnalyzer.getDependencyList();
                    analyzeOk = true;
                } else {
                    analyzeOk = false;
                }
            }

            if (analyzeOk === true) {
                // done something
            } else if (analyzeOk === false) {
                console.error('Unable to build this application due previous errors!');
            }

            console.log("analyzeOk", analyzeOk);

        }





        numFiles = Object.keys(files).length;
        if (numFiles !== 0) {

        }
        return true;
    },
    initFileCache: function () {
        var me = this;
        if (!me.cache) {
            me.cache = Blend.create('Builder.cache.Cache', {
                root: [me.projectFolder],
                exts: ['.xml', '.ms', me.getIndexTemplateExtension()]
            });
        }
    }
});

