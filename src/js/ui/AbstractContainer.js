Blend.defineClass('Blend.ui.AbstractContainer', {
    extend: 'Blend.ui.Component',
    items: null,
    defaults: null,
    layout: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.items = Blend.wrapInArray(me.items || []);
        if (!Blend.isInstanceOf(me.layout, Blend.layout.container.Layout)) {
            throw new Error('Invalid layout type provided for this container. A container layout type was expected!');
        }
    },
    createBodyElement: function () {
        var me = this;
        return {
            oid: 'bodyEl',
            cls: [Blend.cssPrefix('container-body')],
            items: me.layout.render()
        };
    },
    finalizeRender: function (setterMap) {
        var me = this;
        me.layout.setContainerElement(me.bodyEl);
        me.callParent.apply(me, arguments);
    },
    resetVisibleChildrenCache: function () {
        var me = this;
        me._visibleChildren = null;
    },
    getVisibleChildren: function (reset) {
        var me = this;
        reset = reset || false;
        if (reset) {
            me._visibleChildren = null;
        }
        if (!me._visibleChildren) {
            me._visibleChildren = [];
            Blend.foreach(me.items, function (view) {
                if (view.isVisible()) {
                    me._visibleChildren.push(view);
                }
            });
        }
        return me._visibleChildren;
    }
});