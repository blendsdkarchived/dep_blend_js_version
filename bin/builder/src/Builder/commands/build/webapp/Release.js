Blend.defineClass('Builder.commands.build.webapp.Release', {
    requires: [
        'Builder.utils.Minify',
    ],
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
        Logger.info('Minifying ' + scripts.length + ' scripts, please wait...');
        Blend.foreach(scripts, function (item) {
            result.push(FileUtils.readFile(item.source).toString());
        });
        return Template.renderScriptSource(Minify.js(result));
    },
    getIndexTemplateHeader: function () {
        var me = this;
        return [me.deployCSSFiles(me._styles), me._scripts].join("\n");
    }
});