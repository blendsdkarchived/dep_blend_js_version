var fs = require('fs');
var path = require('path');

require("shelljs/global");

Blend.defineClass('Builder.core.Main', {
    requires: [
        'Builder.utils.FileUtils',
        'Builder.utils.Resources',
        'Builder.utils.CommandLine',
        'Builder.utils.Logger',
        'Builder.commands.init.Command',
        'Builder.commands.build.Command',
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
    runCommand: function (className, options) {
        var me = this, command = Blend.create(className, {
            options: options
        });
        me.prepareCoreFiles();
        command.run();
    },
    /**
     * Copies the core Blend files into the SDK source folder since we do not
     * ship those seperately in this package
     * @returns {undefined}
     */
    prepareCoreFiles: function () {
        var me = this, files, sourceFile, targetFile,
                coreFolder = Blend.getSDKFolder('js/core'),
                bcsFolder = Blend.getRootFolder('node_modules/blend-class-system/lib');

        files = fs.readdirSync(bcsFolder);

        files.forEach(function (fileName) {
            sourceFile = bcsFolder + path.sep + fileName;
            targetFile = coreFolder + path.sep + fileName;
            fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
        });

    }
});