Blend.defineClass('Builder.analyzer.Dependency', {
    cache: null,
    projectConfig: null,
    env: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.cache = Blend.create('Builder.cache.Cache', {
            root: [me.projectFolder],
            exts: ['.xml', '.ms', me.getIndexTemplateExtension()]
        });
    },
    /**
     * Retuns the extension of the index template for the watcher
     * @returns {unresolved}
     */
    getIndexTemplateExtension: function () {
        var me = this;
        return path.extname(me.projectConfig.indexTemplate);
    },
});

