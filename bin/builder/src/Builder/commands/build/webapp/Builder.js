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
                buildNumber = me.project.bumpBuildNumber(true),
                headers = Template.renderDevHeaders(
                        Template.renderMetaTags(me.project.meta),
                        Template.renderStyleSheets([].concat(me._stylesheets, me.project.stylesheets)),
                        Template.renderScripts([].concat(me._scripts, me.project.scripts))
                        ),
                index = Template.renderIndex(me.project.getProjectFolder(me.project.indexTemplate), {
                    name: me.project.name,
                    headers: headers,
                    project: me.project,
                    build_number: buildNumber
                }),
                indexFile = me.project.getBuildFolder(me.project.indexTemplate);
        Logger.info('Deploying: ' + indexFile);
        fs.writeFileSync(indexFile, index);
    },
    /**
     * Deploys the scripts and stylesheets in the dev mode
     */
    deployDevScriptsAndStyleSheets: function () {
        var me = this, target, scripts = [], stylesheets = [], status = true,
                prjFolder = me.project.getProjectFolder(), src;
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
                });
                Logger.info('Deploying: ', target.url);
            }
        });

        Blend.foreach([].concat(me.project.scripts, me.project.stylesheets), function (item) {
            src = item.src;
            if (!src.startsWith(prjFolder)) {
                src = me.project.getProjectFolder(item.src);
            }
            if (fs.existsSync(src)) {
                target = me.getTargetPathAndUrl(src);
                if (target) {
                    FileUtils.copyFile(target.srcFile, target.destFile);
                    Logger.info('Deploying: ', target.url);
                }
            } else {
                Logger.error('Unable to deploy:' + src);
                return (status = false);
            }
        });


        me._scripts = scripts;
        me._stylesheets = stylesheets;

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

