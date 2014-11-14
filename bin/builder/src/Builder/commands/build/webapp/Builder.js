var fs = require('fs');
Blend.defineClass('Builder.commands.build.webapp.Builder', {
    extend: 'Builder.commands.build.Base',
    runInternal: function () {
        var me = this, files = [], dmap = [],
                jsfiles, numFiles, numJsFiles;

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
                dmap = me.depAnalyzer.getDependencyMap(files);
                if (!Blend.isObject(dmap)) {
                    console.error('Unable to build this application due previous errors!');
                }
            }
            /**
             * If the dmap is null when something has gone wrong in parsing/analyzing
             * the JS files. If so there is no reason to build the application.
             */
            if (!Blend.isNullOrUndef(dmap)) {

                Blend.foreach(dmap, function (classDef) {
                    console.log(classDef.classFile);
                });
            } else {
                /**
                 * We need to log that we did not build the application
                 */
            }
        }
        return true;
    }
});

