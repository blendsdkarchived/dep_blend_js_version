Blend.defineClass('Builder.commands.build.webapp.Develop', {
    extend: 'Builder.commands.build.Builder',
    _scripts: null,
    _styles: null,
    runInternal: function (dmap) {
        var me = this;
        me._scripts = me.deployScripts(dmap);
        me._styles = me.getCSSFiles(dmap);
        return true;
    },
    deployScripts: function (dmap) {
        var me = this, scripts = me.getScriptFiles(dmap), targetFile, targetName, result = [];
        Logger.info('Deploying ' + scripts.length + ' scripts, please wait...');
        Blend.foreach(scripts, function (item) {
            targetName = 'js/' + item.targetname;
            targetFile = me.project.getBuildFolder(targetName);
            FileUtils.copyFile(item.source, targetFile);
            result.push({src: targetName});
        });
        return result;
    },
    getIndexTemplateHeader: function (metatags) {
        var me = this;
        return [metatags, me.deployCSSFiles(me._styles), Template.renderScripts(me._scripts)].join("\n");
    }
});