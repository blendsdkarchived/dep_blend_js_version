Blend.defineClass('Blend.ui.View', {
    extend: 'Blend.ui.AbstractView',
    /**
     * Config parameter for making this view hidden or visible
     */
    hidden: false,
    /**
     * Config parameter for setting the initial with of this view.
     */
    width: null,
    /**
     * Config parameter for setting the initial height of this view.
     */
    height: null,
    /**
     * Config parameter for setting the initial top of this view.
     */
    top: 0,
    /**
     * Config parameter for setting the initial left of this view.
     */
    left: 0,
    /**
     * Config parameter for setting the base CSS class for this view.
     */
    ui: null,
    /**
     * Sets a base CSS class for this view
     * @param {string/string[]} value
     */
    setUi: function (value) {
        var me = this;
        if (me.ui !== value) {
            me.ui = value;
            Blend.CSS.set(me.element, value);
            me.notifyUIChanged();
        }
    },
    /**
     * Gets the base CSS class of this view. The retuned value is the result of
     * {Blend.dom.CSS.get} which is an array of css class names
     */
    getUi: function () {
        var me = this;
        return (me.ui = Blend.CSS.get(me.element));
    },
    /**
     * Sets the current width of this view
     * @param {number} value
     */
    setWidth: function (value) {
        var me = this;
        if (me.width !== value) {
            me.width = value;
            Blend.Style.set(me.element, {width: value});
            me.notifySizeChanged();
        }
        return me;
    },
    /**
     * Gets the width of this component
     * @returns {number}
     */
    getWidth: function () {
        var me = this,
                val = Blend.Style.get(me.element, 'width');
        return (me.width = val);
    },
    /**
     * Sets the current height of this component
     * @param {number} value
     */
    setHeight: function (value) {
        var me = this;
        if (me.height !== value) {
            me.height = value;
            Blend.Style.set(me.element, {height: value});
            me.notifySizeChanged();
        }
        return me;
    },
    /**
     * Gets the height of this component
     * @returns {number}
     */
    getHeight: function () {
        var me = this,
                val = Blend.Style.get(me.element, 'height');
        return (me.height = val);
    },
    /**
     * Gets the top of this component
     * @returns {number}
     */
    getTop: function () {
        var me = this,
                val = Blend.Style.get(me.element, 'top');
        return (me.top = val);
    },
    /**
     * Gets the left of this component
     * @returns {number}
     */
    getLeft: function () {
        var me = this,
                val = Blend.Style.get(me.element, 'left');
        return (me.left = val);
    },
    /**
     * Sets the current top of this component
     * @param {number} value
     */
    setTop: function (value) {
        var me = this;
        if (me.top !== value) {
            me.top = value;
            Blend.Style.set(me.element, {top: value});
            me.notifyPositionChanged();
        }
        return me;
    },
    /**
     * Sets the current left of this component
     * @param {number} value
     */
    setLeft: function (value) {
        var me = this;
        if (me.left !== value) {
            me.left = value;
            Blend.Style.set(me.element, {left: value});
            me.notifyPositionChanged();
        }
        return me;
    },
    /**
     * Sets the current visibility status. This method internally calls the
     * show() or the hide() method and is made available here for purpose of binding
     * @param {boolean} value
     */
    setVisibility: function (value) {
        var me = this;
        if (value) {
            me.show();
        } else {
            me.hide();
        }
        return me;
    },
    isVisible: function () {
        var me = this;
        return !me.hidden;
    },
    resetParentVisibilityCache: function () {
        var me = this;
        if (me.parent && me.parent.resetVisibleChildrenCache) {
            me.parent.resetVisibleChildrenCache();
        }
    },
    /**
     * Makes this view visible
     * @returns {undefined}
     */
    show: function () {
        var me = this;
        if (me.hidden) {
            me.hidden = false;
            Blend.CSS.unset(me.element, Blend.CSS.CSS_HIDDEN);
            me.resetParentVisibilityCache();
            me.notifyShow();
        }
    },
    /**
     * Makes this view hidden
     */
    hide: function () {
        var me = this;
        if (!me.hidden) {
            me.hidden = true;
            Blend.CSS.set(me.element, Blend.CSS.CSS_HIDDEN);
            me.resetParentVisibilityCache();
            me.notifyHide();
        }
    },
    /**
     * Fires when this view is made visible.
     */
    notifyShow: function () {
        var me = this;
        me.fireEvent('show');
    },
    /**
     * Fires when this view is made hidden.
     */
    notifyHide: function () {
        var me = this;
        me.fireEvent('hide');
    },
    /**
     * Fires when the size of this view is changed
     */
    notifySizeChanged: function () {
        var me = this;
        me.fireEvent('sizeChanged', me.width, me.height);
    },
    /**
     * Fires when the size of this view is changed
     */
    notifyPositionChanged: function () {
        var me = this;
        me.fireEvent('positionChanged', me.top, me.left);
    },
    /**
     * Fires when the UI css class of this view is changed
     * @returns {undefined}
     */
    notifyUIChanged: function () {
        var me = this;
        me.fireEvent('UIChanged', me.ui);
    },
    finalizeRender: function (map) {
        var me = this;
        me.hidden = !me.hidden;
        map = Blend.apply(map || {}, {
            hidden: 'setVisibility',
            ui: 'setUi'
        });
        me.callParent.apply(me, [map]);
    },
    getDefaultLayoutTriggers: function () {
        return [
            'sizeChanged',
            'UIChanged',
            'show',
            'hide'
        ];
    }
});