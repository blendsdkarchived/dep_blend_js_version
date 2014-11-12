var ms = require("mustache");
var path = require("path");
var fs = require("fs");
require("shelljs/global");
Blend.defineClass('Builder.commands.init.Command', {
    extend: 'Builder.commands.Base',
    /**
     * Command entry point
     */
    run: function () {
        var me = this;
        console.log("");
        me.setDefaultPaths();
        if (me.prepareProjectFolder()) {
            if (me.createApplicationConfig()) {
                if (me.createMainClass()) {
                    if (me.createSassFiles()) {
                        console.log(
                                "\n" +
                                "Project " + me.options.projectName + " has been created.\n" +
                                "You can now change directory to " + me.projectFolder + "\n" +
                                "then run: blend build or blend build --watch\n"
                                );
                    }
                }
            }
        }
    },
    setDefaultPaths: function () {
        var me = this;
        me.callParent.apply(me, [me.options.path + path.sep + me.options.projectName]);
    },
    createSassFiles: function () {
        var me = this;
        try {
            Logger.info('Creating SASS and .scss files in resources');
            fs.writeFileSync(me.resourcesFolder + path.sep + 'config.rb', Builder.utils.Resources.readFile('Builder/resources/config.rb'));
            fs.writeFileSync(me.sassFolder + path.sep + me.options.className + '.scss', '/* implement your own rules */');
            return true;
        } catch (e) {
            Logger.error(e);
            process.exit(1);
        }
    },
    createMainClass: function () {
        var me = this, bsfile,
                file, folder, lastpart, className = me.options.className,
                parts = me.options.className.split('.');
        if (parts.length === 1) {
            file = me.sourceFolder + path.sep + className + ".js";
        } else {
            lastpart = (parts[parts.length - 1]).trim();
            if (lastpart === '') {
                Logger.error('Invalid class name: ' + className);
                process.exit(1);
            }
            parts.pop();
            folder = me.sourceFolder + path.sep + parts.join(path.sep);
            file = folder + path.sep + lastpart + ".js";
            try {
                Logger.info('Creating project source folders');
                mkdir('-p', folder);
            } catch (e) {
                Logger.error(e);
                process.exit(1);
            }
            try {
                bsfile = me.sourceFolder + path.sep + 'bootstrap.js';
                Logger.info('Creating main class');
                fs.writeFileSync(file, me.getMainClass());

                Logger.info('Creating bootstap file');
                fs.writeFileSync(bsfile, "Blend.runApplication('" + className + "')");
            } catch (e) {
                Logger.error(e);
                process.exit(1);
            }
            return true;
        }
    },
    /**
     * Creates a new application.json file
     * @returns {undefined}
     */
    createApplicationConfig: function () {
        var me = this;
        try {
            var appConfig = me.projectFolder + path.sep + "application.json";
            Logger.info("Creating project configuration file");
            fs.writeFileSync(appConfig, me.getNewProjectConfiguration());
            me.createGitIgnoreFile(me.projectFolder, ['build']);
            return true;
        } catch (e) {
            Logger.error(e);
            return false;
        }
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
            }
        } catch (e) {
            Logger.error(e);
            return false;
        }
    },
    getMainClass: function () {
        var me = this;
        return ms.render(Builder.utils.Resources.readFile('Builder/resources/mainclass.js.ms'), me.options);
    },
    /**
     * Renedrs a new application.json
     */
    getNewProjectConfiguration: function () {
        var me = this;
        return ms.render(Builder.utils.Resources.readFile('Builder/resources/application.json.ms'), me.options);
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
    },
    /**
     * Creates a .gitignore file in a given path
     * @param {type} filepath
     * @param {type} rules
     * @returns {undefined}
     */
    createGitIgnoreFile: function (filepath, rules) {
        var me = this;
        rules = (rules || []).join("\n");
        try {
            fs.writeFileSync(filepath + path.sep + '.gitignore', rules);
        } catch (e) {
            Logger.error(e);
            process.exit(1);
        }
    },
    /**
     * Override of the exit function to force to exit.
     * @param {type} force
     * @returns {undefined}
     */
    exit: function (force) {
        var me = this;
        force = force || true;
        me.callParent.apply(me, [force]);
    }
});

