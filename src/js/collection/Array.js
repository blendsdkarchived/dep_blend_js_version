/**
 * Represents an array as a collection
 * Items in the collection can be accessed either using their index.
 */
Blend.defineClass('Blend.collection.Array', {
    extend: 'Blend.collection.Collection',
    items: null,
    init: function() {
        var me = this;
        me.callParent.apply(me, arguments);
        if (me.items === null) {
            me.items = [];
        }
    },
    /**
     * Adds a multiple items into the collection.
     * @param {Object} items key/value pare object to be added to the collection
     */
    addAll: function(items) {
        var me = this, k;
        for (k in items) {
            me.items.push(items[k]);
        }
    },
    /**
     * Adds a single item into the collection
     * @param {object} value The value to save in the collection
     */
    add: function(value) {
        var me = this;
        me.items.push(value);
    },
    /**
     * Inserts an element at a given position in the array
     * @param {object} value
     * @param {number} index
     */
    insert: function(value, index) {
        var me = this;
        if (index && Blend.isNumeric(index) && index < me.items.length - 1) {
            if (index < 0) {
                index = 0;
            }
            me.items.splice(index, 0, value);
        } else {
            me.add(value);
        }
        return value;
    },
    /**
     * Retrives an element by its index
     * @param {number} key
     * @return {object} Returns the object if found otherwise it returns null
     */
    get: function(index) {
        var me = this;
        if (me.items[index]) {
            return me.items[index];
        } else {
            return null;
        }
    },
    /**
     * Removes an element from the collection by its index
     * @param {number} index
     * @return {object/boolean} Returns the object that has been removed from
     * the collection or false if nothing removed;
     */
    remove: function(index) {
        var me = this, value;
        if (me.items[index]) {
            value = me.items.splice(index, 1)
            if (value.length === 1) {
                return value[0]
            } else {
                return value;
            }
        } else {
            return false;
        }
    },
    /**
     * counts the number of items in the collection
     * @return {number}
     */
    count: function() {
        var me = this;
        return me.items.length;
    },
    /**
     * removes all the items from the collection
     */
    clear: function() {
        var me = this;
        me.items = [];
    },
    /**
     * @inheritdoc
     */
    parseKey: function(index) {
        return parseFloat(index);
    },
    /**
     * Returns the last item in the collection of null if the collection is empty
     */
    getLast: function() {
        var me = this;
        if (me.items.length > 0) {
            return me.items[me.items.length - 1];
        } else {
            return null;
        }
    },
    /**
     * Retuns the first item in the collection or null if the collection is empty
     */
    getFirst: function() {
        var me = this;
        if (me.items.length > 0) {
            return me.items[0];
        } else {
            return null;
        }
    }
});