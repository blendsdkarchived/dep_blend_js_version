var path = require('path');
Blend.defineClass('Builder.analyzer.Dependency', {
    requires: [
        'Builder.cache.Cache',
        'Builder.analyzer.ClassFinder'
    ],
    projectConfig: null,
    env: null,
    classes: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.classes = {};
    },
    analyze: function (files) {
        var me = this;
        if (me.findAllClasses(files)) {
            console.log(Object.keys(me.classes));
            return true;
        } else {
            console.log(Object.keys(me.classes));
            return false;
        }
    },
    /**
     * Findes all classes based on the latest cache status
     * @returns {undefined}
     */
    findAllClasses: function (files) {
        var me = this, finderResult,
                classFinder = Blend.create('Builder.analyzer.ClassFinder'),
                result = true;

        Blend.foreach(files, function (hash, file) {
            if (path.extname(file) === '.js') {
                finderResult = classFinder.find(file);
                if (finderResult.success === true) {
                    Blend.foreach(finderResult.classes, function (item, className) {
                        if (me.classes[className]) {
                            Logger.info(className + ' updated.');
                        }
                        me.classes[className] = item;
                    });
                } else {
                    Logger.error(finderResult.error + ", in file " + finderResult.file);
                    result = false;
                }
            }
        });
        return result;
    }
});

