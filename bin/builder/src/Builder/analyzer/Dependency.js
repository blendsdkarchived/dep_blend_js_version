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
        var me = this, rootClass = me.projectConfig.mainClass;
        if (me.findAllClasses(files)) {
            /**
             * If retuned true then all the provided files where parsed
             * and nothing crazy happened, so we can continue with analyzing
             * the dependencies.
             */
            if (me.classes[rootClass]) {
                console.log('Hey!');
            } else {
                Logger.error('Unable to find the applications\'s mainClass: ' + rootClass);
                return false;
            }

            return true;
        } else {
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

