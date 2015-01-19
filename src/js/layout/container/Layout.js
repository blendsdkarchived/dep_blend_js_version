Blend.defineClass('Blend.layout.container.Layout', {
    extend: 'Blend.layout.Layout',
    cssPrefix: null,
    containerEl: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me._itemCSS = Blend.cssPrefix(me.cssPrefix + '-layout-item');
    },
    setContainerElement: function (el) {
        var me = this;
        me.containerEl = el;
        Blend.CSS.set(me.containerEl, Blend.cssPrefix(me.cssPrefix + '-layout'));
    },
    render: function () {
        var me = this, view, els = [], views = [], el, defaults = me.view.defaults;
        Blend.foreach(me.view.items, function (itemCfg, idx) {
            view = me.createItemView(itemCfg, defaults);
            me.createItemLayoutContext(view);
            views.push(view);
            el = view.getElement({
                cls: me.getItemCSS()
            });
            els.push(el);
        });
        me.view.items = views;
        return els;
    },
    getElements: function () {
        var me = this;
        return me.containerEl.children;
    },
    getItemCSS: function (view) {
        var me = this;
        return [Blend.cssPrefix('conatiner-item'), me._itemCSS];
    },
    createItemView: function (viewCfg, defaults) {
        var me = this;
        return Blend.ui.Component.createView.apply(me.view, [viewCfg, me.view, defaults]);
    },
    createItemLayoutContext: function (view) {
        view.setLayoutContext({});
    }
});