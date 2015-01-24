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
        var me = this;
        var ctx = me.createItemLayoutContext();
        me.createLayoutContext(force);
        me.handler(ctx, me.layoutContext);
        me.callParent.apply(me, arguments);
    },
    createLayoutContext: function (force) {
        var me = this;
        force = force || false;
        if (force) {
            me.layoutContext = null;
        }
        if (!me.layoutContext) {
            me.layoutContext = {
                pack: me.pack,
                align: me.align,
                margin: me.margin,
                direction: me.direction,
                bounds: Blend.Element.getBounds(me.containerEl),
                layoutHandler: function (ctx, idx) {
                    /**
                     * Only call the sizeChanged event if the bounds of the
                     * view is changed. This will avoid unnecessary layout flows
                     */
                    var view = me.view.items[idx];
                    var bounds = {
                        width: ctx.width,
                        height: ctx.height,
                        top: ctx.top,
                        left: ctx.left
                    };
                    Blend.Style.set(ctx.el, bounds);
                    if (!me.boundsEqual(bounds, ctx.org)) {
                        me.view.items[idx].fireEvent('sizeChanged', bounds.width, bounds.height);
                    }
                }
            };
        }
    },
    createItemLayoutContext: function () {
        var me = this, list = [], ctx, bounds, el;
        /**
         * The Box layout needs to know several properties of the views it is
         * going to layout. These properties are the width/hright/top/left
         * and the flex properties of a view. Next to that wee need to original
         * bounds later to see if we need to fire the sizeChanged event.
         */
        Blend.foreach(me.view.items, function (view) {
            el = view.getElement();
            bounds = Blend.Element.getBounds(el);
            ctx = {
                el: el,
                width: bounds.width,
                height: bounds.height,
                top: bounds.top,
                left: bounds.left
            };
            if (Blend.isNumeric(view.flex)) {
                ctx[me.flexed] = view.flex;
                ctx.flex = true;
                ctx.calculated = false;
            } else {
                ctx.flex = false;
            }
            ctx.org = {
                width: ctx.width,
                height: ctx.width,
                top: ctx.top,
                left: ctx.left
            };
            list.push(ctx);
        });
        return list;
    }
});