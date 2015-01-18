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
    /**
     * @internal
     */
    queueElements: function () {
        var me = this;
        if (!me._queue) {
            me._queue = Blend.createDocumentFragment();
            Blend.foreach(me.view.items, function (el) {
                me._queue.appendChild(el);
            });
        }
    },
    /**
     * @internal
     */
    deQueueElements: function (parent) {
        var me = this;
        if (me._queue) {
            Blend.foreach(me._queue, function (el) {
                parent.appendChild(el);
            });
            me._queue = null;
        }
    },
    getElements: function () {
        var me = this, view,
                elements = [], vitems = [], defaults = me.view.defaults, el;
        if (!me._rendered) {
            Blend.foreach(me.view.items, function (itemCfg, idx) {
                view = me.createItemView(itemCfg, defaults);
                me.createItemLayoutContext(view);
                vitems.push(view);
                el = view.getElement({
                    cls: me.getItemCSS()
                });
                me.containerEl.appendChild(el);
                elements.push(el);
            });
            ;
            me.view.items = vitems;
            me._elements = elements;
            me._rendered = true;
        }
        return me._elements;
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