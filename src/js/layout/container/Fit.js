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
            Blend.foreach(me.view.getVisibleChildren(), function (view, idx) {
                if (idx === ax) {
                    view.show();
                    me._currentView = view;
                    Blend.layout.utils.Fit.fit(me.containerEl, view.getElement(), me);
                } else {
                    view.hide();
                }
            });
        }
        me.callParent.apply(me, arguments);
    },
    handler: function (element, bounds) {
        var me = this,
                vbounds = Blend.Element.getBounds(me._currentView.getElement());
        me._currentView.setBounds(bounds);
    }
});
