Blend.defineClass('Blend.layout.Layout', {
    alias: 'layout.base',
    view: null,
    performLayout: function (force) {
        var me = this;
        me.view.doneLayout();
    },
    render: function (renderCtx) {
        var me = this;
        return me.view.render.apply(me.view, arguments);
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
            } else if (Blend.isObject(layoutConfig) && layoutConfig.type) {
                layoutConfig.type = 'layout.' + layoutConfig.type;
                return Blend.create(Blend.apply(cfg, layoutConfig));
            } else {
                throw new Error('Unable to create a layout based on: ' + layoutConfig);
            }
        }
    }
});