Blend.defineClass('Builder.commands.build.Builder', {
    requires: [
        'Builder.analyzer.Dependency'
    ],
    project: null,
    options: null,
    watcher: null,
    cssWatcher: null,
    run: function () {
        var me = this, error = true,
                analyzer = Blend.create('Builder.analyzer.Dependency'),
                dmap = analyzer.getDependencyMap(me.watcher.getFilesByType('js'), me.project.mainClass);
        me.cleanBuildFolder();
        if (Blend.isObject(dmap)) {
            if (me.buildCssFiles(dmap)) {
                if (me.runInternal(dmap)) {
                    if (me.createIndexTemplate()) {
                        if (me.finalize()) {
                            error = false;
                        }
                    }
                }
            }
        }
        if (error === true) {
            Logger.error('Unable to build this application due previous errors!');
            me.dumpBuildErrors();
        }
    },
    /**
     * Compact and return a style tag with all css data for this project
     * @param {type} styles
     * @returns {unresolved}
     */
    deployCSSFiles: function (styles) {
        var me = this;
        Logger.info('Deploying ' + styles.length + ' styles, please wait....');
        return Template.renderCompactCSS(styles);
    },
    /**
     * Get the list of of CCS files used in this project
     * @param {type} dmap
     * @returns {Array}
     */
    getCSSFiles: function (dmap) {
        var me = this, files = [], file, error = false;
        Blend.foreach(dmap, function (item) {
            if (item.cssFile) {
                files.push(item.cssFile);
            }
        });
        Blend.foreach(me.project.stylesheets, function (item) {
            if (Blend.isString(item)) {
                file = item;
            } else if (Blend.isObject(item) && item.src) {
                file = item.src;
            }
            file = me.project.getProjectFolder(file);
            if (FileUtils.fileExists(file)) {
                files.push(file);
            } else {
                error = true;
                Logger.error('File does not exist: ' + file);
            }
        });
        return error === true ? null : files;
    },
    /**
     * Get the list of all JS files used in this project
     * @param {type} dmap
     * @returns {Array}
     */
    getScriptFiles: function (dmap) {
        var me = this, files = [], file, error = false;
        Blend.foreach(dmap, function (item) {
            files.push({
                targetname: item.className + '.js',
                source: item.classFile
            });
        });
        Blend.foreach(me.project.scripts, function (item) {
            if (Blend.isString(item)) {
                file = item;
            } else if (Blend.isObject(item) && item.src) {
                file = item.src;
            }
            file = me.project.getProjectFolder(file);
            if (FileUtils.fileExists(file)) {
                files.push({
                    targetname: FileUtils.basename(file),
                    source: file
                });
            } else {
                error = true;
                Logger.error('File does not exist: ' + file);
            }
        });
        return error === true ? null : files;
    },
    /**
     * virtual
     * @returns {unresolved}
     */
    getIndexTemplateFooter: function () {
        return null;
    },
    /**
     * virtual
     * @returns {unresolved}
     */
    getIndexTemplateHeader: function () {
        return null;
    },
    /**
     * virtual
     * @returns {Boolean}
     */
    finalize: function () {
        return true;
    },
    /**
     * virtual
     * @param {type} dmap
     * @returns {Boolean}
     */
    runInternal: function (dmap) {
        return true;
    },
    /**
     * Render meta tags for this application
     * @returns {unresolved}
     */
    renderMetaTags: function () {
        var me = this;
        return Template.renderMetaTags(me.project.meta);
    },
    /**
     * Created the index file for the development mode
     * @returns {undefined}
     */
    createIndexTemplate: function () {
        var me = this,
                index = Template.renderIndex(me.project.getProjectFolder(me.project.indexTemplate), {
                    name: me.project.name,
                    headers: me.getIndexTemplateHeader(me.renderMetaTags()),
                    footers: me.getIndexTemplateFooter(),
                    project: me.project
                }),
                indexFile = me.project.getBuildFolder(me.project.indexTemplate);
        me.deployFavIcon();
        Logger.info('Creating: ' + indexFile);
        FileUtils.writeFile(indexFile, index);
        return true;
    },
    /**
     * Deploy the favicon for this project
     * @TODO this methods needs to the investigated and implemented correctly
     * for all device types.
     * @returns {undefined}
     */
    deployFavIcon: function () {
        Logger.warn("Favicon is not implemented yet!");
    },
    /**
     * Get the list of CSS files that where just rendered using compass
     * @returns {unresolved}
     */
    getRenderedCSSFiles: function () {
        var me = this;
        if (!me.cssWatcher) {
            me.cssWatcher = Blend.create('Builder.utils.FolderWatcher', {
                root: [me.project.getProjectFolder(), Blend.getSDKFolder()],
                extensions: ['.css']
            });
        }
        me.cssWatcher.update();
        return me.cssWatcher.getFilesByType('css');
    },
    /**
     * Dump the builder errors to the logger
     * @returns {undefined}
     */
    dumpBuildErrors: function () {
        var me = this;
        Logger.dumpErrors(me.project.getBuildFolder(me.project.indexTemplate));
    },
    /**
     * Deletes the build folder to be recreated later
     */
    cleanBuildFolder: function () {
        var me = this;
        Logger.info('Cleaning build folder.');
        FileUtils.rm('-fR', me.project.getBuildFolder());
    },
    /**
     * Bind css files to with the same name to a class (ClassDefenition.cssFile)
     * @param {type} dmap
     * @returns {undefined}
     */
    buildCssFiles: function (dmap) {
        var me = this, result, folder, cwd,
                className, error = false, cssfiles, themeOk = false;
        theme = Blend.fixPath('css/' + me.project.theme),
                sassConfigs = me.watcher.getFilesByType('rb');
        Logger.info('Building CSS files.');
        sassConfigs.forEach(function (file) {
            if (!file.startsWith(Blend.getSDKFolder())) {
                Logger.info("Compiling SASS files using: " + file.replace(me.project.getProjectFolder(), ''));
                folder = file.replace('config.rb', '');
                cwd = process.cwd();
                process.chdir(folder);
                result = exec('compass compile --boring -c ' + file);
                process.chdir(cwd);
                if (result.code !== 0) {
                    Logger.error("Failed to compile: " + result.output);
                    error = true;
                }
            }
        });
        if (error === true) {
            return false;
        } else {
            cssfiles = me.getRenderedCSSFiles();
            Logger.info("Binding CSS files to classes, please wait...");
            Blend.foreach(cssfiles, function (filename) {
                /**
                 * Here we check the provided theme from the project file
                 */
                if (filename.indexOf(theme) !== -1) {
                    className = FileUtils.basename(filename).replace(FileUtils.extension(filename), '');
                    if (dmap[className]) {
                        dmap[className].cssFile = filename;
                        themeOk = true;
                    }
                }
            });
            if (!themeOk) {
                Logger.warn('No CSS files where detected for theme [' + me.project.theme + ']. Is your theme name correct?');
            }
            return true;
        }
    }
});