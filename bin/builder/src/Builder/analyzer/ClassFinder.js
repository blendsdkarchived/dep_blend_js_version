var esprima = require('esprima');
/**
 * Find Blend classes in a file
 */
Blend.defineClass('Builder.analyzer.ClassFinder', {
    extend: 'Builder.analyzer.Parser',
    classes: null,
    currentFile: null,
    /**
     * Custom visitor implementation
     * @param {type} object
     * @returns {Boolean}
     */
    visitor: function (object) {
        var me = this, classDef = me.getBlendDefineClass(object);
        if (classDef) {

            if (me.classes[classDef.className]) {
                Logger.warn(classDef.className + ' already exists in ' + me.classes[classDef.className].file + ', skipping.')
            } else {
                me.classes[classDef.className] = {
                    file: me.currentFile,
                    classDef: classDef
                }
            }

        }
        return true;
    },
    /**
     * Visitor helper to find the happy flow "Blend.defineClass"
     * @param {type} object
     * @returns {ClassFinderAnonym$0.getBlendDefineClass.ClassFinderAnonym$2}
     */
    getBlendDefineClass: function (object) {
        var result = null, expression, callee, property, cname, cdef = {};
        if (object.type === 'ExpressionStatement') {
            expression = object.expression;
            if (expression.type === 'CallExpression') {
                callee = expression.callee;
                if (callee.type === 'MemberExpression' &&
                        callee.object.type === 'Identifier' &&
                        callee.object.name === 'Blend' &&
                        callee.property.type === 'Identifier' &&
                        callee.property.name === 'defineClass') {
                    if (expression.arguments.length !== 0) {
                        cname = expression.arguments[0].value;
                    }
                    if (expression.arguments.length > 1) {
                        cdef = expression.arguments[1];
                        if (cdef.type === 'ObjectExpression') {
                            cdef = cdef.properties;
                        }
                    }
                    return {
                        className: cname,
                        classDef: cdef
                    }
                }
            }
        }
        return result;
    },
    /**
     * Fined classes in a file. This function is the entry point for this class
     * @param {type} file
     * @returns {object}
     */
    find: function (file) {
        var me = this, parseResult;
        me.classes = {};
        me.currentFile = file;
        parseResult = me.parse(file);
        if (parseResult.success) {
            return  {
                success: true,
                classes: me.classes
            }
        } else {
            return parseResult;
        }
    },
});

