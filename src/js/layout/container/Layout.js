Blend.defineClass('Blend.layout.container.Layout', {
    extend: 'Blend.layout.Layout',
    itemCSSClass: null,
    containerEl: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.itemCSSClass = Blend.cssPrefix(me.itemCSSClass + '-layout-item');
    },
    setContainerElement: function (el) {
        var me = this;
        me.containerEl = el;
    },
    renderItems: function () {
        var me = this, view,
                elements = [], vitems = [];
        Blend.foreach(me.view.items, function (itemCfg, idx) {
            view = me.createItemView(itemCfg);
            me.createItemLayoutContext(view);
            vitems.push(view);
            elements.push(view.getElement({
                cls: [me.getItemCSS()]
            }));
        });
        me.view.items = vitems;
        return elements;
    },
    getItemCSS: function (view) {
        var me = this;
        return [Blend.cssPrefix('conatiner-item'), me.itemCSSClass];
    },
    createItemView: function (viewCfg) {
        var me = this;
        return Blend.ui.Component.createView.apply(me.view, arguments);
    },
    createItemLayoutContext: function (view) {
        view.setLayoutContext({});
    }
});