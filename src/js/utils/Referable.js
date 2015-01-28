Blend.defineClass('Blend.utils.Referable', {
    _refs: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me._refs = {};
    },
    /**
     * @internal
     * Automatically create getters for a given reference.
     * @param {type} items
     * @param {type} key
     */
    autoCreateReferences: function (items, key) {
        var me = this;
        me._refs = {};
        Blend.foreach(items, function (item) {
            if (Blend.isObject(item) && Blend.isString(item[key])) {
                me.setReference(item[key], item);
            }
        });
    },
    /**
     * Gets the reference to an object from a component or a component. This function
     * will either return a single object or an array of objects if there are
     * multiple object with the same reference name.
     * @param {string} refName name of the reference to search.
     * @return {object/object[]} A single object or an array of objects.
     */
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
    /**
     * Sets the reference of a component in this component. This function is
     * internal and should not be used, unless you are absolutely sure of what
     * you are doing. When a reference for component is set, this class automatically
     * will try to create a getter function for the given component. For example if set the
     * a component by refName="text", a function that is called getText(...) will automatically
     * be created in this component. This function optionally consumes a filter callback
     * that can be used to filter a result of the getter function when the getter returns an
     * array of objects.
     * @private
     * @param {string} refName the name of the reference.
     * @param {object} obj The object to create the refenece for.
     */
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
                };
                me._refs[refName] = [obj];
            } else {
                me._refs[refName].push(obj);
            }
        }
    }
});
