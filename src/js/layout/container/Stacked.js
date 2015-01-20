Blend.defineClass('Blend.layout.container.Stacked', {
    extend: 'Blend.layout.container.Fit',
    alias: 'layout.stacked',
    cssPrefix: 'stacked',
    activeItem: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        /**
         * Install the setActiveItem  and getActiveItem to the view for
         * convenience
         */
        me.view.setActiveItem = function () {
            me.setActiveItem.apply(me, arguments);
        }
        me.view.getActiveItem = function () {
            return me.getActiveItem.apply(me, arguments);
        }

    },
    getVisibleItemIndex: function () {
        var me = this, index;
        me.activeItem = me.activeItem || (me.view.items.length !== 0 ? 0 : null);
        if (Blend.isObject(me.activeItem) && me.activeItem.$className$) {
            /**
             * Need to find the index from view items
             */
            Blend.foreach(me.view.items, function (view, idx) {
                if (view === me.activeItem) {
                    index = idx;
                    return false; // will stop the iteration;
                }
            });
        } else {
            index = me.activeItem;
        }
        return index;
    },
    getActiveItem: function (returnView) {
        var me = this,
                idx = me.getVisibleItemIndex();
        returnView = returnView || false;
        if (returnView === true) {
            return me.view.items[idx];
        } else {
            return idx;
        }
    },
    setActiveItem: function (item) {
        var me = this;
        if (item !== me.activeItem) {
            me.activeItem = item;
            me.performLayout();
        }
    }
});
