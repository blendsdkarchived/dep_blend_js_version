Blend.defineClass('Blend.layout.container.Layout', {
    extend: 'Blend.layout.Layout',
    itemCSSClass: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
    },
    performLayout: function () {
        var me = this;
        Blend.foreach(me.view.items, function (child) {
            child.performLayout();
        });
    },
    processChildViews: function (views) {
        return views;
    },
    processChildElements: function (elements) {
        var me = this;
        Blend.foreach(elements, function (el, idx) {
            me.processChildElement(el, idx);
        });
        return elements;
    },
    processViewElement: function (el) {
        var me = this;
        Blend.CSS.set(el, Blend.cssPrefix(me.itemCSSClass + "-layout"));
    },
    processChildElement: function (el, idx) {
        var me = this;
        Blend.CSS.set(el, Blend.cssPrefix(me.itemCSSClass + "-layout-item"));
    }
});