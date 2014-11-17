var path = require('path');
/**
 * Base class providing Dependency Analyzer
 */
Blend.defineClass('Builder.commands.build.AnalyzerBase', {
    extend: 'Builder.commands.build.Base',
    requires: [
        'Builder.analyzer.Dependency'
    ],
    depAnalyzer: null,
    depMap: null,
    /**
     * Creates a dependency anayzer object
     */
    initDepAnalyzer: function () {
        var me = this;
        if (!me.depAnalyzer) {
            me.depAnalyzer = Blend.create('Builder.analyzer.Dependency');
            me.depMap = [];
        }
    },
    runInternal: function () {
        var me = this, files = [], dmap = [],
                jsfiles, numFiles, numJsFiles;

        me.initFileCache();
        me.initDepAnalyzer();

        files = me.cache.update();
        numFiles = Object.keys(files).length;

        if (numFiles !== 0) {

            if (me._didFirstRun) {
                Logger.info(numFiles, 'change(s) detected.');
            }
            me._didFirstRun = true;

            /**
             * Some files have been updated
             */
            jsfiles = me.cache.getJSFiles();
            numJsFiles = Object.keys(jsfiles).length;

            if (numJsFiles !== 0) {
                dmap = me.depAnalyzer.getDependencyMap(jsfiles, me.project.mainClass);
                if (!Blend.isObject(dmap)) {
                    Logger.error('Unable to build this application due previous errors!');
                }
            }
            /**
             * If the dmap is null when something has gone wrong in parsing/analyzing
             * the JS files. If so there is no reason to build the application.
             */
            if (!Blend.isNullOrUndef(dmap)) {
                me.depMap = dmap;
                me.bindCssFiles();
                if (me.buildProject()) {
                    me.bumpBuildNumber();
                }
            } else {
                Logger.dumpErrors(Blend.fixPath(me.project.buildFolder + '/' + me.project.indexTemplate));
            }
        }
        return true;
    },
    /**
     * Bind css files to with the same name to a class (ClassDefenition.cssFile)
     */
    bindCssFiles: function () {
        var me = this,
                files = me.cache.getCSSFiles(), className;
        Blend.foreach(files, function (hash, filename) {
            className = path.basename(filename).replace(path.extname(filename), '');
            if (me.depMap[className]) {
                me.depMap[className].cssFile = filename;
            }
        });
    }
});

