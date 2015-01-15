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
     * Sets the current width of this component
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
    /**
     * Makes this view visible
     * @returns {undefined}
     */
    show: function () {
        var me = this;
        if (me.hidden) {
            me.hidden = false;
            Blend.CSS.unset(me.element, Blend.CSS.CSS_HIDDEN);
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
    finalizeRender: function (map) {
        var me = this;
        me.hidden = !me.hidden;
        map = Blend.apply(map || {}, {
            hidden: 'setVisibility'
        });
        me.callParent.apply(me, [map]);
    }
});