var path = require("path");
Blend.defineClass('Builder.commands.Base', {
    options: null,
    projectFolder: null,
    sourceFolder: null,
    resourcesFolder: null,
    sassFolder: null,
    run: function () {
        return;
    },
    setDefaultPaths: function (projectFolder) {
        var me = this;
        me.projectFolder = projectFolder;
        me.sourceFolder = me.projectFolder + path.sep + 'js';
        me.resourcesFolder = me.projectFolder + path.sep + 'resources';
        me.sassFolder = me.resourcesFolder + path.sep + 'themes' + path.sep + 'default';
        me.options.type = me.options.projectType === 'webapp' ? 'web' : 'touch';
    }

});

