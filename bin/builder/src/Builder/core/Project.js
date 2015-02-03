/**
 * Class representing a project configuration of a BlendJS application
 */
Blend.defineClass('Builder.core.Project', {
    requires: [
        'Builder.utils.FileUtils'
    ],
    projectFile: null,
    projectFolder: null,
    type: null,
    /**
     * Gets the SASS folder and provides an option to append an extra path.
     * @param {type} append
     * @returns {unresolved}
     */
    getSassFolder: function (append) {
        var me = this;
        return me.getProjectFolder('/resources/themes/' + (me.theme || 'default') + '/' + (append || ''));
    },
    /**
     * Gets the JS folder and provides an option to append an extra path.
     * @param {type} append
     * @returns {unresolved}
     */
    getSourceFolder: function (append) {
        var me = this;
        return me.getProjectFolder('/js/' + (append || ''));
    },
    /**
     * Gets the resources folder and provides an option to append an extra path.
     * @param {type} append
     * @returns {unresolved}
     */
    getResourceFolder: function (append) {
        var me = this;
        return me.getProjectFolder('/resources/' + (append || ''));
    },
    /**
     * Gets the project folder and provides an option to append an extra path.
     * @param {type} append
     * @returns {unresolved}
     */
    getProjectFolder: function (append) {
        var me = this;
        return Blend.fixPath(me.projectFolder + '/' + (append || ''));
    },
    /**
     * Gets the build folder and provides an option to append an extra path.
     * @param {type} append
     * @param {type} ensure
     * @returns {unresolved}
     */
    getBuildFolder: function (append, ensure) {
        var me = this, p;
        ensure = ensure || false;
        p = me.getProjectFolder('build/' + (append || ''));
        if (ensure) {
            FileUtils.ensurePath(p);
        }
        return p;
    },
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.setupPaths(me.projectFolder);
    },
    /**
     * Setup common paths
     * @param {type} projectFolder
     * @returns {undefined}
     */
    setupPaths: function (projectFolder) {
        var me = this;
        me.projectFolder = projectFolder;
        me.sourceFolder = me.getProjectFolder('js');
    },
    /**
     * Load this project from a project configuration file.
     * @param {type} filename
     * @returns {Boolean}
     */
    loadFromFile: function (filename) {
        var me = this, res;
        try {
            var data = require(filename);
            res = me.validateConfig(data);
            if (res.isvalid) {
                me.setupPaths(me.projectFolder);
                Blend.apply(me, data);
                me.projectFile = filename;
                return true;
            } else {
                Logger.error(res.error);
                return false;
            }
        } catch (e) {
            Logger.error(e);
            return false;
        }
    },
    /**
     * Check if the provided application type is valid
     * @param {type} cfg description
     */
    isValidAppType: function (cfg) {
        return (!Blend.isNullOrUndef(cfg.type) && (cfg.type === 'webapp' || cfg.type === 'touchapp'));
    },
    /*
     * Validates the project configuration file
     */
    validateConfig: function (cfg) {
        var me = this, valid = false, error = null;
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
     * Check and create the project folder
     * @returns {Boolean}
     */
    prepareProjectFolder: function () {
        var me = this;
        try {
            if (me.checkProjectFolder()) {
                Logger.info("Creating project folder");
                FileUtils.mkdir('-p', [me.getSourceFolder(), me.getResourceFolder(), me.getSassFolder()]);
                return true;
            } else {
                Logger.error("Project folder already exists! " + me.getProjectFolder());
                return false;
            }
        } catch (e) {
            Logger.error(e);
            return false;
        }
    },
    /**
     * Checks if the project folder can be created
     * @returns {Boolean}
     */
    checkProjectFolder: function () {
        var me = this;
        return !FileUtils.folderExists(me.projectFolder);
    }
});
