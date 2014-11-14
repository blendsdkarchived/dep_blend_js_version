var esprima = require('esprima');
/**
 * Find Blend classes in a file
 */
Blend.defineClass('Builder.analyzer.ClassFinder', {
    extend: 'Builder.analyzer.Parser',
    requires: [
        'Builder.analyzer.ClassDefinition'
    ],
    classes: null,
    currentFile: null,
    currentClassName: null,
    /**
     * Custom visitor implementation
     * @param {type} object
     * @returns {Boolean}
     */
    visitor: function (object) {
        var me = this,
                classDef = (
                        me.getBlendDefineClass(object) ||
                        me.getBlendClass(object) ||
                        me.getBlendBaseClass(object)
                        );
        if (classDef) {
            if (me.classes[classDef.className]) {
                Logger.warn(classDef.className + ' already exists in ' + me.classes[classDef.className].file + ', skipping.')
            } else {
                me.classes[classDef.className] = {
                    file: me.currentFile,
                    clazz: classDef
                }
            }

        }
        return true;
    },
    /**
     * Find the Blend root objectß
     */
    getBlendClass: function (object) {
        var me = this, found = 0;
        if (object.type === 'ReturnStatement' && object.argument.type === 'ObjectExpression') {
            Blend.foreach(object.argument.properties, function (prop) {
                if (prop.key.name === 'defineClass' || prop.key.name === 'wrapInArray') {
                    found++;
                }
                if (found === 2) {
                    found = true;
                    return false;
                }
            });
            if (found) {
                return {
                    className: 'Blend',
                    classDef: object.argument.properties
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    /**
     * Find Blend.BaseClass
     */
    getBlendBaseClass: function (object) {
        if (object.type === 'VariableDeclarator' && object.id.name === 'BaseClass') {
            return {
                className: 'Blend.BaseClass',
                classDef: object.init.arguments[0].properties
            };
        } else {
            return null;
        }
    },
    /**
     * Visitor helper to find the happy flow "Blend.defineClass"
     * @param {type} object
     * @returns {Builder.analyzer.ClassDefinition[]}
     */
    getBlendDefineClass: function (object) {
        var me = this,
                result = null,
                expression, callee, property, cname, cdef = [];
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
                        } else {
                            cdef = [];
                            Logger.warn(cname + ' does not have an object for a class definition!')
                        }
                    }
                    return {
                        className: cname,
                        classDef: me.checkSetBaseClass(cdef || [])
                    }
                }
            }
        }
        return result;
    },
    /**
     * Check if the properties have a base class otherwise set to Blend.BaseClass
     * @param {type} props
     * @returns {Array}
     */
    checkSetBaseClass: function (props) {
        var me = this, extend = false;
        if (me.isNullAST(props)) {
            props = [];
        }
        if (Blend.isArray(props)) {
            Blend.foreach(props, function (item) {
                if (item.type === 'Property' && item.key.type === 'Identifier' && item.key.name === 'extend') {
                    extend = true;
                    return false; // stop the loop
                }
            });
            if (!extend) {
                props.push({
                    type: 'Property',
                    key: {
                        type: 'Identifier',
                        name: 'extend'
                    },
                    value: {
                        type: 'Literal',
                        value: 'Blend.BaseClass',
                        raw: "'Blend.BaseClass'"
                    },
                    kind: 'init'
                });
            }
        }
        return props;
    },
    /**
     * Fined classes in a file. This function is the entry point for this class
     * @param {type} file
     * @returns {object}
     */
    find: function (file) {
        var me = this, parseResult, def;
        me.classes = {};
        me.currentFile = file;
        parseResult = me.parse(file);
        parseResult.file = file;
        if (parseResult.success) {
            try {
                var result = {};
                Blend.foreach(me.classes, function (item, name) {
                    def = item.clazz.classDef;
                    me.currentClassName = name;
                    result[name] = Blend.create('Builder.analyzer.ClassDefinition', {
                        classFile: file,
                        className: name,
                        classParent: me.getClassParent(def),
                        requires: me.getArrayProperty('requires', def),
                        controllers: me.getArrayProperty('controllers', def),
                        mixins: me.getMappedObjectProperty('mixins', def)
                    });
                });
                return  {
                    success: true,
                    classes: result
                };
            } catch (e) {
                return {
                    success: false,
                    error: e
                };
            }
        } else {
            return parseResult;
        }
    },
    getMappedObjectProperty: function (name, def) {
        var me = this;
        return me.getASTProperty(name, def) || {};
    },
    getArrayProperty: function (name, def) {
        var me = this;
        return Blend.wrapInArray(me.getASTProperty(name, def) || []);
    },
    getClassParent: function (def) {
        var me = this, value = me.getASTProperty('extend', def);
        if (value && !Blend.isString(value)) {
            throw new Error('The "extend" configuration property of ' + me.currentClassName + ' is not a string!');
        } else {
            return value;
        }
    }
});

