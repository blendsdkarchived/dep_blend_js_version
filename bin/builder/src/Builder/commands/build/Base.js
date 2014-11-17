var fs = require("fs");
var path = require('path');

Blend.defineClass('Builder.commands.build.Base', {
    extend: 'Builder.commands.Base',
    project: null,
    cache: null,
    canBumpBuildNumber: true,
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
    /**
     * Bump the build-number is needed
     */
    bumpBuildNumber: function () {
        var me = this;
        if (me.canBumpBuildNumber === true) {
            me.project.bumpBuildNumber();
        }
    },
    /**
     * Prepares the build folder
     * @returns {Boolean}
     */
    buildProject: function () {
        var me = this;
        try {
            me.cleanBuildFolder();
            me.deployIconFonts();
            return true;
        } catch (e) {
            Logger.error(e);
            return false;
        }
    },
    /**
     * Deletes the build folder to be recreated later
     */
    cleanBuildFolder: function () {
        var me = this;
        Logger.info('Cleanup build folder.');
        rm('-fR', me.project.getBuildFolder());
    },
    /**
     * Deploys the Icon font folder
     * @returns {undefined}
     */
    deployIconFonts: function () {
        var me = this;
        Logger.info('Deploying fonts.');
        cp('-Rf', Blend.getSDKFolder('resources/fonts'), me.project.getBuildFolder('blend/resources', true));
    }
});

