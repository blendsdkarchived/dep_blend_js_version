Blend.defineClass('Blend.ui.Container', {
    extend: 'Blend.ui.AbstractContainer',
    alias: 'ui.container',
    layout: 'default',
    bodyPadding: 0,
    requires: [
        'Blend.layout.container.Default'
    ],
    initElement: function (el) {
        var me = this;
        Blend.apply(el, {
            style: {
                padding: me.bodyPadding
            },
            items: me.createBodyElement()
        });
        return me.callParent.apply(me, arguments);
    },
    layoutView: function (force) {
        var me = this;
        Blend.layout.utils.Fit.fit(me.element, me.bodyEl, null);
        me.callParent.apply(me, arguments);
    }
});