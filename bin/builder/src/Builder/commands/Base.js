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
        me.project = Blend.create('Builder.core.Project', {
            projectFolder: root
        });
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

