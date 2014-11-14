var path = require("path");
Blend.defineClass('Builder.commands.Base', {
    requires: [
        'Builder.core.Project'
    ],
    options: null,
    project: null,
    run: function () {
        return;
    },
    initProject: function (root) {
        var me = this;
        if (!me.project) {
            me.project = Blend.create('Builder.core.Project', {
                projectFolder: root
            });
        } else {
            me.project.setupPaths(root);
        }
    }
});

