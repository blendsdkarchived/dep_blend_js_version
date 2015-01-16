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
    renderItems: function (defaults) {
        var me = this, view,
                elements = [], vitems = [];
        Blend.foreach(me.view.items, function (itemCfg, idx) {
            view = me.createItemView(itemCfg, defaults);
            me.createItemLayoutContext(view);
            vitems.push(view);
            elements.push(view.getElement({
                cls: me.getItemCSS()
            }));
        });
        me.view.items = vitems;
        return elements;
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