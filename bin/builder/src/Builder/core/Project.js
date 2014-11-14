var path = require('path');
var fs = require('fs');

Blend.defineClass('Builder.core.Project', {
    projectFolder: null,
    buildFolder: null,
    sourceFolder: null,
    resourcesFolder: null,
    sassFolder: null,
    type: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.setupPaths(me.projectFolder);
    },
    setupPaths: function (projectFolder) {
        var me = this;
        me.projectFolder = projectFolder;
        me.sourceFolder = me.projectFolder + path.sep + 'js';
        me.resourcesFolder = me.projectFolder + path.sep + 'resources';
        me.sassFolder = me.resourcesFolder + path.sep + 'themes' + path.sep + 'default';
        me.buildFolder = me.projectFolder + '/build';
    },
    loadFromFile: function (filename) {
        var me = this, res;
        try {
            var data = require(filename);
            res = me.validateConfig(data);
            if (res.isvalid) {
                Blend.apply(me, data);
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
        var me = this, sassFolder;
        try {
            if (me.checkProjectFolder()) {
                Logger.info("Creating project folder");
                mkdir('-p', [me.sourceFolder, me.resourcesFolder, me.sassFolder]);
                return true;
            } else {
                Logger.error("Project folder already exists! " + me.projectFolder);
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
        /**
         * This should throw if folder exists
         */
        var me = this;
        try {
            fs.statSync(me.projectFolder);
            return false;
        } catch (e) {
            return true;
        }
    }
});
