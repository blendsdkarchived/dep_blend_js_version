var path = require('path');
Blend.defineClass('Builder.analyzer.Dependency', {
    requires: [
        'Builder.cache.Cache',
        'Builder.analyzer.ClassFinder'
    ],
    cache: null,
    projectConfig: null,
    env: null,
    classes: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.classes = {};
        me.cache = Blend.create('Builder.cache.Cache', {
            root: [me.env.projectFolder],
            exts: ['.xml', '.ms', me.getIndexTemplateExtension()]
        });
    },
    analyze: function () {
        var me = this;
        me.findAllClasses();
        return true;
    },
    /**
     * Findes all classes based on the latest cache status
     * @returns {undefined}
     */
    findAllClasses: function () {
        var me = this, finderResult,
                files = me.cache.update(),
                classFinder = Blend.create('Builder.analyzer.ClassFinder');
        Blend.foreach(files, function (hash, file) {
            if (path.extname(file) === '.js') {
                finderResult = classFinder.find(file);
                if (finderResult.success === true) {
                    Blend.foreach(finderResult.classes, function (item, className) {
                        if (me.classes[className]) {
                            Logger.warn(className + ' already exists in ' + me.classes[className].file + ', skipping.')
                        } else {
                            me.classes[className] = item;
                        }
                    });
                }
            }
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

