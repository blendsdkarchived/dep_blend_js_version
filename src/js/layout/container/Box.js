Blend.defineClass('Blend.layout.container.Box', {
    extend: 'Blend.layout.container.Layout',
    requires: [
        'Blend.layout.utils.Box'
    ],
    align: 'start',
    pack: 'start',
    margin: 0,
    layoutContext: null,
    direction: null,
    handler: null,
    performLayout: function (force) {
        var me = this, ctx;
        force = force || false;
        if (force) {
            me.layoutContext = null;
        }
        ctx = me.getItemLayoutContexts();
        me.createLayoutContext();
        me.handler(me.containerEl, me.getElements(), ctx, me.layoutContext);
        // call the parent to layout the children
        me.callParent.apply(me, arguments);
    },
    createLayoutContext: function () {
        var me = this;
        if (!me.layoutContext) {
            me.layoutContext = {
                pack: me.pack,
                align: me.align,
                margin: me.margin,
                direction: me.direction,
                bounds: Blend.Element.getBounds(me.containerEl),
                boundsSetter: function (el, bounds, idx) {
                    var view = me.view.items[idx];
                    var vbounds = Blend.Element.getBounds(view.getElement());
                    Blend.Style.set(el, bounds);
                    if (vbounds.top !== bounds.top ||
                            vbounds.left !== bounds.left ||
                            vbounds.width !== bounds.width ||
                            vbounds.height !== bounds.height) {
                        me.view.items[idx].fireEvent('sizeChanged', bounds.width, bounds.height);
                    }

                }
            };
        }
    },
    getItemLayoutContexts: function () {
        var me = this, ctx = [];
        Blend.foreach(me.view.items, function (view) {
            ctx.push(view.getLayoutContext());
        });
        return ctx;
    }
});