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
    }
});

