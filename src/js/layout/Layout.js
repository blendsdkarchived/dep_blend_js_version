Blend.defineClass('Blend.layout.Layout', {
    alias: 'layout.base',
    view: null,
    viewLayoutContext: null,
    setLayoutContext: function (ctx) {
        var me = this;
        me.viewLayoutContext = ctx;
    },
    performLayout: function () {
        return;
    },
    statics: {
        createLayout: function (view, layoutConfig) {
            var me = this, cfg = {
                view: view
            };
            if (Blend.isInstanceOf(layoutConfig, Blend.layout.Layout)) {
                return layoutConfig;
            } else if (Blend.isString(layoutConfig)) {
                layoutConfig = Blend.isAliasOfType('layout', layoutConfig) ? 'layout.' + layoutConfig : layoutConfig;
                return Blend.create(layoutConfig, cfg);
            } else if (Blend.isObject(layoutConfig)) {
                return Blend.create(Blend.apply(cfg, layoutConfig));
            } else {
                throw new Error('Unable to create a layout based on: ' + layoutConfig);
            }
        }
    }
});