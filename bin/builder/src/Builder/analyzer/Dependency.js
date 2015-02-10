var path = require('path');
Blend.defineClass('Builder.analyzer.Dependency', {
    requires: [
        'Builder.analyzer.ClassFinder'
    ],
    classes: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.classes = {};
    },
    /**
     * Findes all classes based on the latest cache status
     * @returns {undefined}
     */
    findAllClasses: function (files) {
        var me = this, finderResult,
                classFinder = Blend.create('Builder.analyzer.ClassFinder'),
                result = true;
        Blend.foreach(files, function (file) {
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
        });
        console.log('');
        return result;
    },
    getDependencyMap: function (files, rootClass) {
        var me = this, map = [], orderedMap = {};
        Logger.info('Analysing dependencies of ' + Object.keys(files).length + ' file(s), please wait...');
        if (me.findAllClasses(files)) {
            /**
             * If retuned true then all the provided files where parsed
             * and nothing crazy happened, so we can continue with analyzing
             * the dependencies.
             */
            if (me.classes[rootClass]) {
                if (!me.addDependency(rootClass, map)) {
                    return null;
                } else {
                    Blend.foreach(map, function (className) {
                        orderedMap[className] = me.classes[className];
                    });
                    return orderedMap;
                }
            } else {
                Logger.error('Unable to find the applications\'s mainClass: ' + rootClass);
                return null;
            }
        } else {
            return null;
        }
    },
    addDependency: function (className, map) {
        var me = this,
                cdef = me.classes[className] || null,
                deps, status = true;
        if (cdef) {
            map.unshift(className);
            deps = cdef.getDependencies();
            Blend.foreach(deps, function (dep) {
                if (dep !== null) {
                    /**
                     * checking for null is special here since there is only one class
                     * that does not extend from anything, that is the BaseClass
                     */
                    status = me.addDependency(dep, map);
                    if (!status) {
                        return false;
                    }
                }
            });
            return status;
        } else {
            Logger.error('Unable to create dependency map due missing: ' + className);
            return false;
        }
    }
});

