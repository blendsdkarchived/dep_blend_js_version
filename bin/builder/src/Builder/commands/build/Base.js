var fs = require("fs");
var path = require('path');

Blend.defineClass('Builder.commands.build.Base', {
    extend: 'Builder.commands.Base',
    project: null,
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
    }
});

