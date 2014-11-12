Blend.defineClass('Builder.core.Main', {
    requires: [
        'Builder.utils.Resources',
        'Builder.utils.CommandLine',
        'Builder.utils.Logger',
        'Builder.commands.init.Command',
        'Builder.commands.build.Command',
    ],
    version: '2.0',
    run: function () {
        var me = this, options;
        console.log('BlendJS builder version ' + me.version);
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
    runCommand: function (className, options) {
        var command = Blend.create(className, {
            options: options
        });
        command.run();
    }
});