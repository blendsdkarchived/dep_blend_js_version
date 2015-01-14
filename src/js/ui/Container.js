Blend.defineClass('Blend.ui.Container', {
    extend: 'Blend.ui.Component',
    alias: 'ui.container',
    items: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.items = Blend.wrapInArray(me.items || []);
    },
    initElement: function (el) {
        var me = this;
        el = me.callParent.apply(me, arguments);
        el.items = el.items = [];
        me.createBodyElement(el);
        return el;
    },
    renderItems: function () {
        var me = this, items = [], view;
        Blend.foreach(me.items, function (item, idx) {
            view = me.createChildView(item);
            me.items[idx] = view;
            items.push(view.getElement({
                cls: [Blend.cssPrefix('conatiner-item')]
            }));
        });
        return items;
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
        return el;
    }
});