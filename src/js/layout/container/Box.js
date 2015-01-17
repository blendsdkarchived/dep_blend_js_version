Blend.defineClass('Blend.layout.container.Box', {
    extend: 'Blend.layout.container.Layout',
    align: 'start',
    pack: 'start',
    margin: 0,
    layoutContext: null,
    direction: null,
    handler: null,
    performLayout: function (force) {
        var me = this;
        force = force || false;
        if (force) {
            me.layoutContext = null;
        }
        me.getElements();
        me.createLayoutContext();
        me.getItemLayoutContexts();
        me.handler(me.containerEl, me.getElements(), me._itemLCtx, me.layoutContext);
    },
    createLayoutContext: function () {
        var me = this;
        if (!me.layoutContext) {
            me.layoutContext = {
                pack: me.pack,
                align: me.align,
                margin: me.margin,
                direction: me.direction,
                bounds: Blend.Element.getBounds(me.containerEl)
            };
        }
    },
    getItemLayoutContexts: function () {
        var me = this;
        if (!me._itemLCtx) {
            me._itemLCtx = [];
            Blend.foreach(me.view.items, function (view) {
                me._itemLCtx.push(view.getLayoutContext());
            });
        } else {
            return me._itemLCtx;
        }
    }
});