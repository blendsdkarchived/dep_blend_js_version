var fs = require('fs');
var path = require('path');

Blend.defineClass('Builder.commands.build.webapp.Builder', {
    extend: 'Builder.commands.build.AnalyzerBase',
    /**
     * Build the Development version of the application
     * @returns {undefined}
     */
    buildDevelVersion: function () {
        var me = this, target, scripts = [], stylesheets = [];
        /**
         * Build steps:
         * [1] Clean the build folder. This is done by the base before getting here.
         * [2] Deploy the mandatory blend resources, font icons and images. (blend folder)
         * [3] Deploy blend's JavaScript files (blend folder)
         * [4] Deploy application's js files
         * @returns {Boolean}
         */
        me.deployIconFonts();
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
        me.project.scripts = scripts.concat(me.project.scripts);
        me.project.stylesheets = stylesheets.concat(me.project.stylesheets);
    },
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

