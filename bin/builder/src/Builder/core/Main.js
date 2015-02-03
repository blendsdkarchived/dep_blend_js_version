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
        me.prepareCoreFiles();
        command.run();
    },
    /**
     * Copies the core Blend files into the SDK source folder since we do not
     * ship those seperately in this package
     * @returns {undefined}
     */
    prepareCoreFiles: function () {
        var me = this, files, sourceFile, targetFile, src, dst,
                coreFolder = Blend.getSDKFolder('js/core'),
                bcsFolder = Blend.getRootFolder('node_modules/blend-class-system/lib');

        files = FileUtils.listDir(bcsFolder);

        files.forEach(function (fileName) {
            sourceFile = Blend.fixPath(bcsFolder + '/' + fileName);
            targetFile = Blend.fixPath(coreFolder + '/' + fileName);
            FileUtils.ensurePath(targetFile);
            FileUtils.writeFile(targetFile, FileUtils.readFile(sourceFile));
        });

        //copy the Blend.utils.String
        src = Blend.getRootFolder('bin/builder/src/Builder/utils/String.js');
        dst = Blend.getSDKFolder('js/utils/String.js');
        FileUtils.copyFile(src, dst);
    }

});