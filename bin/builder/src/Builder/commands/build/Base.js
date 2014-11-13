var fs = require("fs");
var path = require('path');
Blend.defineClass('Builder.commands.build.Base', {
    extend: 'Builder.commands.Base',
    requires: [
        'Builder.analyzer.Dependency'
    ],
    projectConfig: null,
    runInternal: null,
    depAnalyzer: null,
    /**
     * Command entry point
     */
    run: function () {
        var me = this, res;
        me.callParent.apply(me, arguments);
        res = me.loadProjectConfiguration();
        if (res.isvalid === true) {
            me.setDefaultPaths();
            return me.runInternal();
        } else {
            Logger.error(res.error);
            me.exit();
            return false;
        }
    },
    /**
     * Creates a dependency anayzer object
     */
    createDepAnalyzer: function () {
        var me = this;
        me.depAnalyzer = me.depAnalyzer || Blend.create('Builder.analyzer.Dependency', {
            projectConfig: me.projectConfig,
            env: {
                projectFolder: me.projectFolder,
                sourceFolder: me.sourceFolder,
                resourcesFolder: me.resourcesFolder,
                sassFolder: me.sassFolder,
                sdkFolder: Blend.getSDKFolder()
            }
        });
    },
    /**
     * Prepares the paths of the environment in which this builder is running
     * @returns {undefined}
     */
    setDefaultPaths: function () {
        var me = this,
                p = me.options.path.split(path.sep),
                last = p[p.length - 1];
        if (last.indexOf('.json') !== -1) {
            p.pop();
        }
        p = p.join(path.sep);
        me.callParent.apply(me, [p])
    },
    /*
     * Validates the project configuration file
     */
    validateConfig: function () {
        var me = this, valid = false, error = null,
                cfg = me.projectConfig;
        if (Blend.isString(cfg.mainClass)) {
            if (Blend.isString(cfg.name)) {
                if (Blend.isString(cfg.indexTemplate)) {
                    if (Blend.isString(cfg.theme)) {
                        if (me.isValidAppType(cfg)) {
                            valid = true;
                        } else {
                            error = "Invalid or missing application type. Use either webapp or touch app";
                        }
                    } else {
                        error = 'Missing or invalid [theme]';
                    }
                } else {
                    error = 'Missing or invalid [indexTemplate]';
                }
            } else {
                error = 'Missing or invalid [name]';
            }
        } else {
            error = 'Missing or invalid [mainClass]';
        }
        return {
            isvalid: valid,
            error: (error ? error + ' in project configuration;' : null)
        };
    },
    /**
     * Check if the provided application type is valid
     */
    isValidAppType: function (cfg) {
        return (!Blend.isNullOrUndef(cfg.type) && (cfg.type === 'webapp' || cfg.type === 'touchapp'));
    },
    /**
     * Loads the project configuration file
     * @returns {Boolean}
     */
    loadProjectConfiguration: function () {
        var me = this;
        try {
            me.projectConfig = require(me.options.path);
            return me.validateConfig();
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
    }
});

