/**
 * Command class that is responsible for creating (initializing) a new application
 */
Blend.defineClass('Builder.commands.init.Command', {
    extend: 'Builder.commands.Base',
    reqtires: [
        'Builder.utils.FileUtils',
        'Builder.utils.Template'
    ],
    run: function () {
        var me = this;
        console.log("");
        me.initProject();
        if (me.project.prepareProjectFolder(me.options)) {
            if (me.createApplicationConfig()) {
                if (me.createMainClass()) {
                    if (me.createSassFiles()) {
                        if (me.createIndexTemplate()) {
                            console.log(
                                    "\n" +
                                    "Project " + me.options.projectName + " has been created.\n" +
                                    "You can now change directory to " + me.project.getProjectFolder() + "\n" +
                                    "then run: blend build or blend build --watch\n"
                                    );
                        }
                    }
                }
            }
        }
    },
    /**
     * Create the IndexTemplate file for this project
     * @returns {Boolean}
     */
    createIndexTemplate: function () {
        var me = this;
        try {
            Logger.info('Creating ' + me.options.indexTemplate + ' template file.');
            FileUtils.writeFile(
                    me.project.getProjectFolder('/' + me.options.indexTemplate),
                    Builder.utils.Resources.readFile('Builder/resources/index.' + me.options.projectType + '.ms')
                    );
            FileUtils.writeFile(me.project.getProjectFolder('/favicon.ico'), Builder.utils.Resources.readFile('Builder/resources/favicon.ico'));
            return true;
        } catch (e) {
            Logger.error(e);
            process.exit(1);
        }
    },
    /**
     * Creates the SASS files and other COMPASS requirements
     * @returns {Boolean}
     */
    createSassFiles: function () {
        var me = this;
        try {
            Logger.info('Creating SASS and .scss files in resources');
            FileUtils.writeFile(me.project.getResourceFolder('/config.rb'), Builder.utils.Resources.readFile('Builder/resources/config.rb'));
            FileUtils.writeFile(me.project.getSassFolder('/' + me.options.className + '.scss'), '/* implement your own rules */');
            me.createGitIgnoreFile(me.project.getResourceFolder(), ['.sass-cache']);
            return true;
        } catch (e) {
            Logger.error(e);
            process.exit(1);
        }
    },
    /**
     * Creates the mainClass for this application
     * @returns {Boolean}
     */
    createMainClass: function () {
        var me = this, bsfile,
                file, folder, lastpart, className = me.options.className,
                parts = me.options.className.split('.');
        if (parts.length === 1) {
            file = me.project.getSourceFolder('/' + className + '.js');

        } else {
            lastpart = (parts[parts.length - 1]).trim();
            if (lastpart === '') {
                Logger.error('Invalid class name: ' + className);
                process.exit(1);
            }
            parts.pop();
            folder = me.project.getSourceFolder('/' + parts.join('/'));
            file = Blend.fixPath(folder + '/' + lastpart + ".js");
            try {
                Logger.info('Creating project source folders');
                FileUtils.mkdir('-p', folder);
            } catch (e) {
                Logger.error(e);
                process.exit(1);
            }
        }
        try {
            bsfile = me.project.getSourceFolder('/bootstrap.js');
            Logger.info('Creating main class');
            FileUtils.writeFile(file, me.getMainClass());

            Logger.info('Creating bootstap file');
            FileUtils.writeFile(bsfile, "Environment.runApplication('" + className + "')");
        } catch (e) {
            Logger.error(e);
            process.exit(1);
        }
        return true;
    },
    /**
     * Renders the main class file
     * @returns {unresolved}
     */
    getMainClass: function () {
        var me = this;
        return Template.render(Builder.utils.Resources.readFile('Builder/resources/mainclass.js.ms'), me.options);
    },
    /**
     * Creates a new application.json file
     * @returns {undefined}
     */
    createApplicationConfig: function () {
        var me = this;
        try {
            var appConfig = me.project.getProjectFolder('/application.json');
            Logger.info("Creating project configuration file");
            FileUtils.writeFile(appConfig, me.getNewProjectConfiguration());
            me.createGitIgnoreFile(me.project.getProjectFolder(), ['build']);
            return true;
        } catch (e) {
            Logger.error(e);
            return false;
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
            FileUtils.writeFile(Blend.fixPath(filepath + '/' + '.gitignore'), rules);
        } catch (e) {
            Logger.error(e);
            process.exit(1);
        }
    },
    /**
     * Renedrs a new application.json
     */
    getNewProjectConfiguration: function () {
        var me = this;
        return Template.render(Builder.utils.Resources.readFile('Builder/resources/application.json.ms'), me.options);
    },
    initProject: function () {
        var me = this;
        me.callParent.apply(me, [Blend.fixPath(me.options.path + '/' + me.options.projectName)]);
        me.options.type = me.options.projectType === 'webapp' ? 'web' : 'touch';
    }
});

