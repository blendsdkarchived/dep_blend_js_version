var readlineSync = require('readline-sync');
var path = require('path');
var fs = require('fs');
Blend.defineClass('Builder.utils.CommandLine', {
    options: {},
    /**
     * Getter for the options
     */
    getOptions: function () {
        return this.options;
    },
    /**
     * Validated the provided options or exists with error/showusage
     * @returns {Boolean}
     */
    validateOptions: function () {
        var me = this, pathResult;
        me.initParseOptions();
        if (me.options.command === 'build') {
            pathResult = me.validateBuildPath();
            if (pathResult.result === true) {
                return true;
            } else {
                Logger.error("Invalid --path option due:" + pathResult.error);
                process.exit(1);
            }
        } else if (me.options.command === 'init') {
            return true;
        } else {
            return false;
        }
    },
    /**
     * Check if the build path is valid
     * @returns {boolean}
     */
    validateBuildPath: function () {
        var me = this, stat,
                file;
        try {
            stat = fs.statSync(me.options.path);
            result = true;
            if (stat.isDirectory()) {
                file = path.resolve(me.options.path + '/application.json');
                me.options.path = file;
                return me.validateBuildPath();
            } else if (stat.isFile()) {
                file = me.options.path;
            }
            return {
                file: file,
                result: true
            };
        } catch (e) {
            return {
                result: false,
                error: e.message
            }
        }
    },
    getOption: function (message, defaults) {
        var deftxt = defaults ? ' (' + defaults + '):' : '';
        return readlineSync.question(message + deftxt) || defaults;
    },
    /**
     * Basic
     * @returns {undefined}
     */
    initParseOptions: function (command) {
        var rand = (new Date().getTime()) / 1000;
        var me = this,
                ok = true,
                command = (command ? command.split(' ') : null) || process.argv.slice(2);
        if (command.length !== 0) {
            if (command.indexOf('init') !== -1) {
                console.log("\nThis utility will walk you through creating a new BlendJS application.\n" +
                        "Press ^C at any time to quit.\n");
                me.options = {
                    command: 'init',
                    projectName: me.getOption('Project name', 'MyApp_' + rand),
                    className: me.getOption('Main class name', 'MyApp.core.Main'),
                    projectType: me.getOption('Project type [webapp|touchapp]', 'webapp'),
                    indexTemplate: me.getOption('Index file', 'index.html'),
                    path: process.cwd()
                }
            } else if (command.indexOf('build') !== -1) {
                me.options = {
                    command: 'build',
                    watch: (command.indexOf('--watch') !== -1),
                    release: (command.indexOf('--release') !== -1),
                    noserve: (command.indexOf('--noserve') !== -1),
                    path: me.getPathOption(command)
                };
            } else {
                ok = false;
            }
        } else {
            ok = false;
        }
        return ok;
    },
    /**
     * `shoes the usage information and forces the application to exit.
     * @returns {undefined}
     */
    showUsage: function () {
        console.log(Builder.utils.Resources.getUsage());
        process.exit();
    },
    /**
     * Simple --path parser
     */
    getPathOption: function (command) {
        var opt = opt = process.cwd();
        Blend.foreach(command, function (itm) {
            itm = itm.split('=');
            if (itm.length === 2 && itm[0] === '--path') {
                opt = path.resolve(itm[1]);
            }
        });
        return opt;
    }
});