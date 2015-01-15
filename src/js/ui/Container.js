Blend.defineClass('Blend.ui.Container', {
    extend: 'Blend.ui.Component',
    alias: 'ui.container',
    layout: 'default',
    requires: [
        'Blend.layout.container.Default'
    ],
    items: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.items = Blend.wrapInArray(me.items || []);
        if (!Blend.isInstanceOf(me.layout, Blend.layout.container.Layout)) {
            throw new Error('Invalid layout type provided for this container. A container layout type was expected!');
        }
    },
    initElement: function (el) {
        var me = this;
        el = me.callParent.apply(me, arguments);
        el.items = el.items = [];
        me.createBodyElement(el);
        return el;
    },
    createBodyElement: function (el) {
        var me = this;
        el.items.push({
            oid: 'bodyEl',
            cls: [Blend.cssPrefix('container-body')],
            items: me.renderItems()
        });
    },
    finalizeRender: function (el) {
        var me = this;
        me.layout.setContainerElement(me.bodyEl);
        return el;
    },
    performLayout: function () {
        var me = this;
        me.layout.performLayout.apply(me.layout, arguments);
    },
    renderItems: function () {
        var me = this;
        return me.layout.renderItems.apply(me.layout, arguments);
    }
});