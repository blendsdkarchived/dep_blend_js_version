Blend.defineClass('Builder.analyzer.ClassDefinition', {
    className: null,
    classParent: null,
    classFile: null,
    cssFile: null,
    mixins: null,
    requires: null,
    controllers: null,
    properties: null,
    methods: null,
    targetPath: null,
    /**
     * Returns the list of all dependencies
     * @returns {undefined}
     */
    getDependencies: function () {
        var me = this;
        if (!me._allDeps) {
            me._allDeps = [].concat([me.classParent], me.requires, me.controllers);
            Blend.foreach(me.mixins, function (clazz) {
                me._allDeps.push(clazz);
            });
        }
        return me._allDeps;
    }
});

