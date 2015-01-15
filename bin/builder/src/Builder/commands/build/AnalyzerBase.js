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
            } else if (dmap.length === 0) {
                /**
                 * If no JS files where updated then use the previous dependecy map
                 */
                dmap = me.depMap;
            }

            /**
             * If the dmap is null when something has gone wrong in parsing/analyzing
             * the JS files. If so there is no reason to build the application.
             */
            if (!Blend.isNullOrUndef(dmap)) {
                me.depMap = dmap;
                me.bindCssFiles();
                me.checkSetTargetPath();
                if (me.buildProject()) {
                    me.bumpBuildNumber();
                }
            } else {
                Logger.dumpErrors(me.project.getBuildFolder(me.project.indexTemplate));
            }
        }
        return true;
    },
    /**
     * Checks and sets the target path of each class ins the dependency map
     * @returns {undefined}
     */
    checkSetTargetPath: function () {
        var me = this, classFile,
                sdkPath = Blend.getSDKFolder(),
                prjPath = me.project.projectFolder;

        Blend.foreach(me.depMap, function (classDef, className) {
            classFile = classDef.classFile;
            if (classFile.startsWith(sdkPath)) {
                classDef.targetFile = classFile.replace(sdkPath, me.project.getBuildFolder('blend'));
            } else {
                classDef.targetFile = classFile.replace(prjPath, me.project.getBuildFolder());
            }
        });
    },
    /**
     * Bind css files to with the same name to a class (ClassDefenition.cssFile)
     */
    bindCssFiles: function () {
        var me = this,
                files = me.cache.getCSSFiles(),
                className,
                theme = Blend.fixPath('css/' + me.project.theme);
        Blend.foreach(files, function (hash, filename) {
            /**
             * Here we check the provided theme from the project file
             */
            if (filename.indexOf(theme) !== -1) {
                className = path.basename(filename).replace(path.extname(filename), '');
                if (me.depMap[className]) {
                    me.depMap[className].cssFile = filename;
                }
            }
        });
    }
});

