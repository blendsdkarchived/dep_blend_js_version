Blend.defineClass('Blend.layout.container.Center', {
    extend: 'Blend.layout.container.Layout',
    alias: 'layout.center',
    cssPrefix: 'center',
    centerX: true,
    centerY: true,
    getVisibleItemIndex: function () {
        return 0;
    },
    performLayout: function () {
        var me = this;
        Blend.foreach(me.view.items, function (view, idx) {
            if (idx === me.getVisibleItemIndex()) {
                view.show();
                Blend.LayoutUtil.center(me.containerEl, view.getElement(), me.centerY, me.centerX);
            } else {
                view.hide();
            }
        });
    }
});