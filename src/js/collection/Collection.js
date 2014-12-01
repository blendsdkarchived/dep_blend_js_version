/**
 * Base class for Blend.collection.Array and Blend.collection.Object
 * @private
 */
Blend.defineClass('Blend.collection.Collection', {
    items: null,
    /**
     * This function is used to collect/find items in the collection. For each
     * item in the collection the specified [compareFn] is called. If the [compareFn]
     * returns [true] then the item is collected and returned.
     * <p>
     * The [compareFn] method can accept the following parameters.
     * <ul>
     *      <li><b>item</b>: the item in the collection</li>
     *      <li><b>key</b>: the key of the item</li>
     *      <li><b>index</b>: the numeric index of the item</i>
     *      <li><b>the collection</b>: reference to this collection, handy
     *      when you run this function in a different scope</li>
     * </ul>
     * </p>
     * @param {boolean} returnArray Whether to return the items as an array.
     * if not provided it defaults to [false] otherwise a new collection
     * is returned.
     * @return {Blend.core.Collection/array}
     */
    find: function(compareFn, returnArray) {
        var me = this, result = {}, r, idx = 0;
        returnArray = returnArray || false;
        if (Blend.isFunction(compareFn)) {
            me.each(function(item, key) {
                if (compareFn(item, key, idx, me) === true) {
                    result[key] = item;
                }
                idx++;
            });
        }
        r = Blend.create(me.$className$);
        r.addAll(result);
        if (returnArray) {
            return r.toArray();
        } else {
            return r;
        }
    },
    /**
     * Returns a javascript array of the items in the collection
     * without the identifer keys
     * @return {array} Returns the collection as an array.
     */
    toArray: function() {
        var me = this, r = [];
        me.each(function(item) {
            r.push(item)
        });
        return r;
    },
    /**
     * Executes the specified callback function once for every item in the collection.
     * By returning a [false] from the callback function the iteration will be stopped.
     * <p>
     * The callback method can accept the following parameters.
     * <ul>
     *      <li><b>item</b>: the item in the collection</li>
     *      <li><b>key</b>: the key of the item</li>
     *      <li><b>index</b>: the numeric index of the item</i>
     *      <li><b>the collection</b>: reference to this collection, handy
     *      when you run this function in a different scope</li>
     * </ul>
     * </p>
     * @param {function} callback
     * The callback function to be called on each element of the collection
     * @param {object} scope
     * The scope in which the callback function should be called. It defaults
     * to this collection if no scope it provided.
     */
    each: function(callback, scope) {
        var me = this, k, i = 0;
        scope = scope || me;
        for (k in me.items) {
            callback.apply(scope, [me.items[k], me.parseKey(k), i, me]);
            i++;
        }
    },
    /**
     * This function is used internally to parse the object/array key to
     * a usable value other than a string. For example key "129" can be converted
     * to 129
     * @private
     */
    parseKey: function(index) {
        return index;
    }
});
