Blend.defineClass('Blend.layout.container.Fit', {
    extend: 'Blend.layout.container.Layout',
    alias: 'layout.fit',
    itemCSSClass: 'fit',
    getVisibleItemIndex: function () {
        return 0;
    },
    performLayout: function () {
        var me = this;
        Blend.foreach(me.view.items, function (view, idx) {
            if (idx === me.getVisibleItemIndex()) {
                view.show();
                Blend.LayoutUtil.fit(me.containerEl, view.getElement());
            } else {
                view.hide();
            }
        });
    }
});
