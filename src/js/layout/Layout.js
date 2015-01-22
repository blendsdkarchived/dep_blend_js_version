Blend.defineClass('Blend.layout.Layout', {
    alias: 'layout.base',
    view: null,
    performLayout: function (force) {
        return;
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
    },
    /**
     * @protected check if two provided bounds are equal
     * @param {type} ba
     * @param {type} bb
     * @returns {Boolean}
     */
    boundsEqual: function (ba, bb) {
        var p = ['top', 'right', 'bottom', 'left'], a, l = p.length, r = false, t;
        for (a = 0; a !== l; a++) {
            t = p[a];
            if (ba[t] !== bb[t]) {
                r = true;
            }
            if (r) {
                break;
            }
        }
        return !r;
    }
});