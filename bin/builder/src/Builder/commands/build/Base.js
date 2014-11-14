var fs = require("fs");
var path = require('path');

Blend.defineClass('Builder.commands.build.Base', {
    extend: 'Builder.commands.Base',
    requires: [
        'Builder.analyzer.Dependency'
    ],
    project: null,
    depAnalyzer: null,
    depMap: null,
    cache: null,
    /**
     * Command entry point
     */
    run: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        if (me.loadProjectConfiguration()) {
            return me.runInternal();
        } else {
            me.exit();
            return false;
        }
    },
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
    /**
     * Creates a file cache object
     */
    initFileCache: function () {
        var me = this;
        if (!me.cache) {
            me.cache = Blend.create('Builder.cache.Cache', {
                root: [me.project.projectFolder, Blend.getSDKFolder()],
                exts: ['.xml', '.ms', me.getIndexTemplateExtension()]
            });
        }
    },
    /**
     * Gets the path of current project
     * @returns {undefined}
     */
    getProjectPath: function () {
        var me = this,
                p = me.options.path.split(path.sep),
                last = p[p.length - 1];
        if (last.indexOf('.json') !== -1) {
            p.pop();
        }
        return  p.join(path.sep);
    },
    /**
     * Loads the project configuration file
     * @returns {Boolean}
     */
    loadProjectConfiguration: function () {
        var me = this;
        try {
            me.initProject(me.getProjectPath());
            return me.project.loadFromFile(me.options.path);
        } catch (e) {
            Logger.error(e);
            me.exit();
            return false;
        }
    },
    /**
     * Exit the program if not in watch mode
     * @returns {undefined}
     */
    exit: function (force) {
        var me = this;
        force = force || false;
        if (me.options.watch !== true || force === true) {
            process.exit(1);
        }
    },
    /**
     * Retuns the extension of the index template for the watcher
     * @returns {unresolved}
     */
    getIndexTemplateExtension: function () {
        var me = this;
        return path.extname(me.project.indexTemplate);
    },
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
                dmap = me.depAnalyzer.getDependencyMap(files, me.project.mainClass);
                if (!Blend.isObject(dmap)) {
                    Logger.error('Unable to build this application due previous errors!');
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
                Logger.dumpErrors(Blend.fixPath(me.project.buildFolder + '/' + me.project.indexTemplate));
            }
        }
        return true;
    }
});

