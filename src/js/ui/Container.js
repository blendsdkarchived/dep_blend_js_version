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
    createChildViews: function () {
        var me = this, view;
        Blend.foreach(me.items, function (item, idx) {
            view = me.createChildView(item);
            me.items[idx] = view;
        });
        me.items = me.layout.processChildViews(me.items);
    },
    renderItems: function () {
        var me = this, items = [];
        me.createChildViews();
        Blend.foreach(me.items, function (view, idx) {
            items.push(view.getElement({
                cls: [Blend.cssPrefix('conatiner-item')]
            }));
        });
        return me.layout.processChildElements(items);
    },
    createChildView: function (viewCfg) {
        var me = this;
        return Blend.ui.Component.createView.apply(me, arguments);
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
        me.layout.processViewElement(me.bodyEl);
        return el;
    }
});