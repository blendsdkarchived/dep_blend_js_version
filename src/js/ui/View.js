Blend.defineClass('Blend.ui.View', {
    extend: 'Blend.ui.AbstractView',
    /**
     * Configuration parameter for making this view hidden or visible
     */
    hidden: false,
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
    finalizeRender: function (map) {
        var me = this;
        me.hidden = !me.hidden;
        map = Blend.apply(map || {}, {
            hidden: 'setVisibility'
        });
        me.callParent.apply(me, [map]);
    }
});