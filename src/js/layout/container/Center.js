Blend.defineClass('Blend.layout.container.Center', {
    extend: 'Blend.layout.container.Layout',
    requires: [
        'Blend.layout.utils.Center'
    ],
    alias: 'layout.center',
    cssPrefix: 'center',
    centerX: true,
    centerY: true,
    getVisibleItemIndex: function () {
        return 0;
    },
    performLayout: function (force) {
        var me = this;
        Blend.foreach(me.view.items, function (view, idx) {
            if (idx === me.getVisibleItemIndex()) {
                view.show();
                Blend.layout.utils.Center.center(me.containerEl, view.getElement(), me.centerY, me.centerX, me);
                view.performLayout(force);
            } else {
                view.hide();
            }
        });
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
