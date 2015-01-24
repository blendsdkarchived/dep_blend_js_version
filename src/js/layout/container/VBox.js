Blend.defineClass('Blend.layout.container.VBox', {
    extend: 'Blend.layout.container.Box',
    alias: 'layout.vbox',
    cssPrefix: 'vbox',
    handler: function () {
        var util = Blend.layout.utils.Box;
        return util.vflex.apply(util, arguments);
    },
    updateLayoutContext: function (ctx) {
        var me = this, size, rflex, rfixed, pi;
        if (ctx.delta.top < 0) {
            pi = Blend.Element.getSizeAndPosition(ctx.top.getElement());
            size = pi.height + ctx.delta.top;
            if (ctx.top.layoutContext.flex) {
                size = me.unit2Flex(size);
                rflex = ctx.top.layoutContext.size - size;
                ctx.top.layoutContext.size = size;
            } else if (ctx.top.layoutContext.fixed) {
                rfixed = ctx.top.layoutContext.size.height - size;
                ctx.top.layoutContext.size.height = size;
            }
            if (ctx.bottom.layoutContext.flex) {
                ctx.bottom.layoutContext.size += rflex || me.unit2Flex(Math.abs(ctx.delta.top));
            } else if (ctx.bottom.layoutContext.fixed) {
                ctx.bottom.layoutContext.size.height += rfixed || Math.abs(ctx.delta.top);
            }
        } else {

            pi = Blend.Element.getSizeAndPosition(ctx.bottom.getElement());
            size = pi.height - ctx.delta.top;
            if (ctx.bottom.layoutContext.flex) {
                size = me.unit2Flex(size);
                rflex = ctx.bottom.layoutContext.size - size;
                ctx.bottom.layoutContext.size = size;
            } else if (ctx.bottom.layoutContext.fixed) {
                rfixed = ctx.bottom.layoutContext.size.height - size;
                ctx.bottom.layoutContext.size.height = size;
            }

            if (ctx.top.layoutContext.flex) {
                ctx.top.layoutContext.size += rflex || me.unit2Flex(Math.abs(ctx.delta.top));
            } else if (ctx.top.layoutContext.fixed) {
                ctx.top.layoutContext.size.height += rfixed || Math.abs(ctx.delta.top);
            }


        }
        me.performLayout();
    }
});