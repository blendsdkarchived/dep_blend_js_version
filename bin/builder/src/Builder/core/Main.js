/**
 * Kickstart class for this builder. This class is responsible for reading and
 * executing the commandline parameters provided by the user
 */
Blend.defineClass('Builder.core.Main', {
    requires: [
        'Builder.utils.String', // will be translated to Blend.utils.String
        'Builder.utils.Logger',
        'Builder.utils.FileUtils',
        'Builder.commands.init.Command'
    ],
    run: function () {
        var me = this, options;
        console.log('BlendJS Builder v' + Blend.getPackage().version);
        var commandLine = Blend.create('Builder.utils.CommandLine');
        if (commandLine.validateOptions()) {
            options = commandLine.getOptions();
            if (options.command === 'init') {
                me.runCommand('Builder.commands.init.Command', options);
            } else if (options.command === 'build') {
                me.runCommand('Builder.commands.build.Command', options);
            }
        } else {
            commandLine.showUsage();
        }
    },
    /**
     * Internal function creating a command object and run it
     * @param {type} className
     * @param {type} options
     * @returns {undefined}
     */
    runCommand: function (className, options) {
        var me = this, command = Blend.create(className, {
            options: options
        });
        command.run();
    }
});