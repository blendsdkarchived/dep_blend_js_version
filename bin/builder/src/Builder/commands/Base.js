/**
 * Base class for creating a command
 */
Blend.defineClass('Builder.commands.Base', {
    requires: [
        'Builder.core.Project'
    ],
    options: null,
    project: null,
    run: function () {
        return;
    },
    /**
     * Initialize the project configuration
     * @param {type} root
     * @returns {undefined}
     */
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

