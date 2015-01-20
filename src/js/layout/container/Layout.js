Blend.defineClass('Blend.layout.container.Layout', {
    extend: 'Blend.layout.Layout',
    cssPrefix: null,
    containerEl: null,
    itemIndex: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me._itemCSS = Blend.cssPrefix(me.cssPrefix + '-layout-item');
    },
    performLayout: function (force) {
        var me = this;
        // layout the chidlren
        Blend.foreach(me.view.items, function (view) {
            view.performLayout(force);
        });
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
            view.itemIndex = idx;
            views.push(view);
            el = view.getElement({
                cls: me.getItemCSS()
            });
            els.push(el);
        });
        me.view.items = views;
        return els;
    },
    /**
     * @internal getter function to return the containerEls children
     */
    getElements: function () {
        var me = this;
        return me.containerEl.children;
    },
    /**
     * @internal returns the item css for this layout
     */
    getItemCSS: function () {
        var me = this;
        return [Blend.cssPrefix('conatiner-item'), me._itemCSS];
    },
    /**
     * @internal
     * Creates a View based on the view config and the provided defaults
     * @param {type} viewCfg
     * @param {type} defaults
     * @returns {unresolved}
     */
    createItemView: function (viewCfg, defaults) {
        var me = this;
        return Blend.ui.Component.createView.apply(me.view, [viewCfg, me.view, defaults]);
    },
    /**
     * @internal
     * Creates layoutContext for this view
     * @param {type} view
     * @returns {undefined}
     */
    createItemLayoutContext: function (view) {
        view.setLayoutContext({
            flex: view.flex || null
        });
    },
    createItemIndex: function () {
        var me = this;
        me.itemIndex = {};
        Blend.foreach(me.views, function (view, idx) {
            me.itemIndex[view]
        });
    }
});