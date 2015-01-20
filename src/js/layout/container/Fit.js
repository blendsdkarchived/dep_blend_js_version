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
                    Blend.layout.utils.Fit.fit(me.containerEl, view.getElement());
                    view.performLayout(force);
                } else {
                    view.hide();
                }
            });
        }
    }
});
