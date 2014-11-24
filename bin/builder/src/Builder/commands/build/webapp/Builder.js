var fs = require('fs');
var path = require('path');

Blend.defineClass('Builder.commands.build.webapp.Builder', {
    extend: 'Builder.commands.build.AnalyzerBase',
    /**
     * Build the Development version of the application
     * @returns {undefined}
     */
    buildDevelVersion: function () {
        var me = this;
        /**
         * Build steps:
         * [1] Clean the build folder. This is done by the base before getting here.
         * [2] Deploy the mandatory blend resources, font icons and images. (blend folder)
         * [3] Deploy blend's JavaScript files (blend folder)
         * [4] Deploy application's js files
         * @returns {Boolean}
         */
        me.deployIconFonts();
        if (me.deployDevScriptsAndStyleSheets()) {
            me.createDevIndex();
            return true;
        } else {
            return false;
        }

    },
    /**
     * Created the index file for the development mode
     * @returns {undefined}
     */
    createDevIndex: function () {
        var me = this,
                headers = Template.renderDevHeaders(
                        Template.renderMetaTags(me.project.meta),
                        Template.renderStyleSheets(me._stylesheets.concat(me.project.stylesheets)),
                        Template.renderScripts(me._scripts.concat(me.project.scripts))
                        ),
                index = Template.renderIndex(me.project.getProjectFolder(me.project.indexTemplate), {
                    name: me.project.name,
                    headers: headers
                }),
                indexFile = me.project.getBuildFolder(me.project.indexTemplate);
        Logger.info('Deploying: ' + indexFile);
        fs.writeFileSync(indexFile, index);
    },
    /**
     * Deploys the scripts and stylesheets in the dev mode
     */
    deployDevScriptsAndStyleSheets: function () {
        var me = this, target, scripts = [], stylesheets = [], status = true;

        Blend.foreach(me.depMap, function (item, cname) {
            target = me.getTargetPathAndUrl(item.classFile);
            if (target) {
                FileUtils.copyFile(target.srcFile, target.destFile);
                scripts.push({
                    src: target.url
                });
                Logger.info('Deploying: ', target.url);
            }
            if (item.cssFile) {
                target = me.getTargetPathAndUrl(item.cssFile);
                FileUtils.copyFile(target.srcFile, target.destFile);
                stylesheets.push({
                    src: target.url
                })
                Logger.info('Deploying: ', target.url);
            }
        });

        Blend.foreach([].concat(me.project.scripts, me.project.stylesheets), function (item) {
            if (fs.existsSync(item.src)) {
                target = me.getTargetPathAndUrl(item.src);

                if (target) {
                    FileUtils.copyFile(target.srcFile, target.destFile);
                    scripts.push({
                        src: target.url
                    });
                    Logger.info('Deploying: ', target.url);
                }
            } else {
                Logger.error('Unable to deploy:' + item.src);
                return (status = false);
            }
        });


        me._scripts = scripts;
        me._stylesheets = stylesheets;

        target = me.getTargetPathAndUrl(me.project.getSourceFolder('bootstrap.js'));
        FileUtils.copyFile(target.srcFile, target.destFile);

        return status;
    },
    /**
     * Translates the deployment path
     */
    getTargetPathAndUrl: function (file) {
        var me = this, dst, srcFile, destFile,
                sdkPath = Blend.getSDKFolder(),
                prjPath = me.project.getProjectFolder();
        if (file.startsWith(sdkPath)) {
            dst = file.replace(Blend.fixPath(sdkPath + '/'), 'blend/');
            srcFile = file;
            destFile = me.project.getBuildFolder(dst);
        } else {
            dst = file.replace(Blend.fixPath(prjPath), '');
            srcFile = file;
            destFile = me.project.getBuildFolder(dst);
        }
        return {
            srcFile: srcFile,
            destFile: destFile,
            url: dst.split(path.sep).join('/')
        }
    }
});

