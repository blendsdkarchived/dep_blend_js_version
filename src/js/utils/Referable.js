Blend.defineClass('Blend.utils.Referable', {
    _refs: null,
    init: function () {
        var me = this;
        me._refs = {};
    },
    autoCreateReferences: function (items, key) {
        var me = this;
        me._refs = {};
        Blend.foreach(items, function (item) {
            if (Blend.isObject(item) && Blend.isString(item[key])) {
                me.setReference(item[key], item);
            }
        });
    },
    getReference: function (refName) {
        var me = this;
        if (me._refs[refName]) {
            if (me._refs[refName].length === 1) {
                return me._refs[refName][0];
            } else {
                return me._refs[refName];
            }
        } else {
            return null;
        }
    },
    setReference: function (refName, obj) {
        var me = this, getterName, filter;
        if (refName && obj) {
            if (!me._refs[refName]) {
                getterName = 'get' + Blend.camelCase(refName);
                me[getterName] = function (filter) {
                    filter = Blend.isFunction(filter) ? filter : function (vals) {
                        return vals;
                    };
                    var values = me.getReference(refName);
                    if (Blend.isArray(values)) {
                        return filter.apply(me, [values]);
                    } else {
                        return values;
                    }
                }
                me._refs[refName] = [obj];
            } else {
                me._refs[refName].push(obj);
            }
        }
    }
});
