Blend.defineClass('Builder.commands.build.Builder', {
    requires: [
        'Builder.analyzer.Dependency'
    ],
    project: null,
    options: null,
    watcher: null,
    run: function () {
        var me = this,
                analyzer = Blend.create('Builder.analyzer.Dependency'),
                dmap = analyzer.getDependencyMap(me.watcher.getFilesByType('js'), me.project.mainClass);
        me.cleanBuildFolder();
        if (Blend.isObject(dmap)) {

        } else {
            me.dumpBuildErrors();
            Logger.error('Unable to build this application due previous errors!');
        }
    },
    dumpBuildErrors: function () {
        var me = this;
        Logger.dumpErrors(me.project.getBuildFolder(me.project.indexTemplate));
    },
    /**
     * Deletes the build folder to be recreated later
     */
    cleanBuildFolder: function () {
        var me = this;
        Logger.info('Cleanup build folder.');
        FileUtils.rm('-fR', me.project.getBuildFolder());
    }
});