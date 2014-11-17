var path = require('path');
var fs = require('fs');

Blend.defineClass('Builder.core.Project', {
    projectFile: null,
    buildNumberFile: null,
    projectFolder: null,
    buildFolder: null,
    sourceFolder: null,
    resourcesFolder: null,
    sassFolder: null,
    type: null,
    getProjectFolder: function (append) {
        var me = this;
        return Blend.fixPath(me.projectFolder + '/' + (append || ''));
    },
    getBuildFolder: function (append, ensure) {
        var me = this, p;
        ensure = ensure || false;
        p = me.getProjectFolder('build/' + (append || ''));
        if (ensure) {
            FileUtils.ensurePath(p);
        }
        return p;
    }
    ,
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
        me.buildNumberFile = me.projectFolder + path.sep + 'build-number'
    },
    loadFromFile: function (filename) {
        var me = this, res;
        try {
            var data = require(filename);
            res = me.validateConfig(data);
            if (res.isvalid) {
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
    },
    /**
     * Bumps the build-number if possible
     */
    bumpBuildNumber: function () {
        var me = this, bn = 0;
        try {
            if (fs.existsSync(me.buildNumberFile)) {
                bn = fs.readFileSync(me.buildNumberFile);
                bn = parseInt(bn);
            }
            if (!Blend.isNumeric(bn)) {
                bn = 0;
            }
            bn++;
            fs.writeFileSync(me.buildNumberFile, bn);
            Logger.info('Bumped the build number to: ' + bn);
        } catch (e) {
            Logger.warn(e);
        }
    }
});
