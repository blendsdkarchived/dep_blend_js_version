var esprima = require('esprima');
var fs = require('fs');
Blend.defineClass('Builder.analyzer.Parser', {
    parseOptions: null,
    lastError: null,
    visitor: function () {
        return false;
    },
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.parseOptions = me.parseOptions || {};
        me.parseOptions = Blend.apply(me.parseOptions, {tolerant: true});
    },
    parse: function (filename) {
        var me = this,
                syntax;
        try {
            syntax = esprima.parse(fs.readFileSync(filename, 'utf-8'), me.parseOptions);
            return {
                success: me.traverse(syntax),
                error: me.lastError
            };
        } catch (e) {
            return {
                success: false,
                error: e
            };
        }
    },
    /**
     * Executes visitor on the object and its children (recursively).
     * Source: esprima.org
     * @param {type} object
     * @param {type} visitor
     * @returns {undefined}
     */
    traverse: function (object) {
        var me = this, key, child, ok;
        ok = me.visitor.apply(me, [object]);
        if (ok) {
            for (key in object) {
                if (object.hasOwnProperty(key) && ok) {
                    child = object[key];
                    if (typeof child === 'object' && child !== null) {
                        ok = me.traverse(child);
                    }
                }
            }
        }
        return ok;
    },
    isNullAST: function (obj) {
        return (obj.type && obj.type === 'Literal' && obj.value === null);
    },
    getASTValue: function (ast) {
        var me = this, value = ast;
        if (ast.type === 'Literal') {
            value = ast.value;
        } else if (ast.type === 'ArrayExpastsion') {
            value = [];
            Blend.foreach(ast.elements, function (el) {
                value.push(el.value);
            });
        } else if (ast.type === 'ObjectExpression') {
            value = {};
            console.log('hey!');
            Blend.foreach(ast.properties, function (prop) {
                if (prop.key.type === 'Identifier') {
                    value[prop.key.name] = me.getASTValue(prop.value);
                }
            });
        }
        return value;
    },
    getASTProperty: function (name, props) {
        var me = this, res = null;
        Blend.foreach(props, function (prop) {
            if (prop.type === 'Property' && prop.key.name === name) {
                res = prop.value;
                return false; // stop the loop
            }
        });
        if (res) {
            res = me.getASTValue(res);
        }
        return res;
    }
});

