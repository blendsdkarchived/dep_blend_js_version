Blend.defineClass('Blend.layout.container.Stacked', {
    extend: 'Blend.layout.container.Fit',
    alias: 'layout.stacked',
    cssPrefix: 'stacked',
    activeItem: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        /**
         * Install the setActiveItem to the view for convenience
         * @returns {undefined}
         */
        me.view.setActiveItem = function () {
            me.setActiveItem.apply(me, arguments);
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
    setActiveItem: function (item) {
        var me = this;
        if (item !== me.activeItem) {
            me.activeItem = item;
            me.performLayout();
        }
    }
});
