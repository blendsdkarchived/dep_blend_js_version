Blend.defineClass('Blend.layout.container.Box', {
    extend: 'Blend.layout.container.Layout',
    requires: [
        'Blend.layout.utils.Box'
    ],
    align: 'start',
    pack: 'start',
    splitter: false,
    margin: 0,
    layoutContext: null,
    handler: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        if (me.splitter === true) {
            if (Blend.ClassBuilder.classDb.isClassDefined('Blend.ui.Splitter')) {
                Blend.ui.Splitter.initialize(me);
            } else {
                throw new Error('Blend.ui.Splitter not defined! In order to enable the HBox/VBox layouts to have splitters you need to require Blend.ui.Splitter and set the splitter:true in your layout config!');
            }
        }
    },
    performLayout: function (force) {
        var me = this;
        me.itemContext = me.createItemLayoutContext();
        me.layoutContext = me.createLayoutContext();
        me.handler(me.itemContext, me.layoutContext);
        me.callParent.apply(me, arguments);
    },
    createLayoutContext: function () {
        var me = this;
        return  {
            pack: me.pack,
            align: me.align,
            margin: me.margin,
            direction: me.direction,
            bounds: me.view.getBounds(true),
            scroll: me.view.scroll,
            handler: function (ctx, idx) {
                var views = me.view.getVisibleChildren(),
                        view = views[idx];
                view.setBounds(ctx);
            }
        };
    },
    createItemLayoutContext: function () {
        var me = this, list = [], ctx;
        Blend.foreach(me.view.getVisibleChildren(), function (view) {
            ctx = view.getBounds();
            ctx.itemIndex = view.itemIndex;
            if (Blend.isNumeric(view.flex)) {
                ctx.flex = true;
                ctx.flexSize = view.flex;
            } else {
                ctx.flex = false;
                ctx.flexSize = 0;
            }
            list.push(ctx);
        });
        return list;
    }
});