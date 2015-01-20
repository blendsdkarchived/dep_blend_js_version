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
        };

        me.view.getActiveItem = function () {
            return me.getActiveItem.apply(me, arguments);
        };

    },
    getVisibleItemIndex: function () {
        var me = this, view;
        me.activeItem = me.activeItem || (me.view.items.length > 0 ? me.view.items[0] : null);
        if (Blend.isInstanceOf(me.activeItem, Blend.ui.Component)) {
            return me.activeItem.itemIndex;
        } else if (Blend.isNumeric(me.activeItem)) {
            view = me.view.items[me.activeItem];
            if (view) {
                return view.itemIndex;
            }
        }
        me.activeItem = -1;
        return -1;
    },
    getActiveItem: function () {
        var me = this,
                idx = me.getVisibleItemIndex();
        return me.view.items[idx];
    },
    setActiveItem: function (item) {
        var me = this;
        if (item !== me.activeItem) {
            me.activeItem = item;
            me.performLayout();
        }
    }
});
