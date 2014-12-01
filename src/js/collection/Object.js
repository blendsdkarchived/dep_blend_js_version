/**
 * Represents a collection of key/value pairs. The keys must be unique in the
 * collection. Items in the collection can be accessed either using their index
 * or the key.
 */
Blend.defineClass('Blend.collection.Object', {
    extend: 'Blend.collection.Collection',
    items: null,
    index: null,
    init: function() {
        var me = this;
        me.callParent.apply(me, arguments);
        if (me.items === null) {
            me.items = {};
        }
    },
    /**
     * Adds a multiple items into the collection.
     * @param {Object} items key/value pare object to be added to the collection
     */
    addAll: function(items) {
        var me = this, k;
        for (k in items) {
            me.items[k] = items[k];
        }
        me.reIndex();
    },
    /**
     * Adds a single item into the collection
     * @param {string/object} key
     * The key to identify the value in the collection.
     * @param {object} value
     * The value to save in the collection
     */
    add: function(key, value) {
        var me = this;
        me.items[key] = value;
        me.reIndex();
    },
    /**
     * Retrives an element by its key
     * @param {object/string} key
     * @return {object} Returns the object if found otherwise it returns null
     */
    get: function(key) {
        var me = this;
        if (me.items[key]) {
            return me.items[key];
        } else {
            return null;
        }
    },
    /**
     * Retrives an element by its index
     * @param {number} index
     * @return {object} Returns the object if found otherwise it returns null
     */
    getAt: function(index) {
        var me = this;
        return me.get(me.index[index]);
    },
    /**
     * Removes an element from the collection by its key
     * @param {object/string} key
     * @return {object/boolean} Returns the object that has been removed from
     * the collection or false if nothing removed;
     */
    remove: function(key) {
        var me = this, value;
        if (me.items[key]) {
            value = me.items[key];
            delete(me.items[key]);
            me.reIndex();
            return value;
        } else {
            return false;
        }
    },
    /**
     * Removes an element from the collection by its index
     * @param {number} index
     * @return {object/boolean} Returns the object that has been removed from
     * the collection or false if nothing removed;
     */
    removeAt: function(index) {
        var me = this;
        return me.remove(me.index[index]);
    },
    /**
     * counts the number of items in the collection
     * @return {number}
     */
    count: function() {
        var me = this;
        return me.index.length;
    },
    /**
     * removes all the items from the collection
     */
    clear: function() {
        var me = this;
        me.items = {};
        me.index = [];
    },
    /**
     * Retrives all the keys from the collection
     * @return {array}
     */
    getKeys: function() {
        var me = this;
        return me.index;
    },
    /**
     * Check if the collection hase an item with a given key
     * @param {Object} key the key to look for in the collection.
     */
    hasKey: function(key) {
        var me = this;
        return me.items[key] ? true : false;
    },
    /**
     * Reindexes the collection. This method is internal and should not be used
     * @private
     */
    reIndex: function() {
        var me = this;
        me.index = Object.keys(me.items);
    }
});