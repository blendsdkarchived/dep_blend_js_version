Blend.defineClass('Blend.layout.container.Fit', {
    extend: 'Blend.layout.container.Layout',
    alias: 'layout.fit',
    cssPrefix: 'fit',
    getVisibleItemIndex: function () {
        return 0;
    },
    performLayout: function () {
        var me = this,
                ax = me.getVisibleItemIndex();
        Blend.foreach(me.view.items, function (view, idx) {
            if (idx === ax) {
                view.show();
                Blend.LayoutUtil.fit(me.containerEl, view.getElement());
            } else {
                view.hide();
            }
        });
    }
});
