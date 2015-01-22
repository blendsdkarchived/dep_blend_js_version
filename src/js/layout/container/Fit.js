Blend.defineClass('Blend.layout.container.Fit', {
    extend: 'Blend.layout.container.Layout',
    requires: [
        'Blend.layout.utils.Fit'
    ],
    alias: 'layout.fit',
    cssPrefix: 'fit',
    getVisibleItemIndex: function () {
        return 0;
    },
    performLayout: function (force) {
        var me = this,
                ax = me.getVisibleItemIndex();
        if (ax !== -1) {
            Blend.foreach(me.view.items, function (view, idx) {
                if (idx === ax) {
                    view.show();
                    me._currentView = view;
                    Blend.layout.utils.Fit.fit(me.containerEl, view.getElement(), me);
                } else {
                    view.hide();
                }
            });
        }
    },
    layoutHandler: function (element, bounds) {
        var me = this,
                vbounds = Blend.Element.getBounds(me._currentView.getElement());
        Blend.Style.set(element, bounds);
        if (!me.boundsEqual(bounds, vbounds)) {
            me._currentView.fireEvent('sizeChaged', bounds.width, bounds.height);
        }
    }
});
