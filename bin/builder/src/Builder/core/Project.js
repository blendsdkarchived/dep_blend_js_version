var path = require('path');
var fs = require('fs');

Blend.defineClass('Builder.core.Project', {
    projectFolder: null,
    sourceFolder: null,
    resourcesFolder: null,
    sassFolder: null,
    projectType: null,
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
    },
    loadFromFile: function (filename) {

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
