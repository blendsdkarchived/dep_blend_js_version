Blend.defineClass('Blend.layout.Util', {
    singleton: true,
    /**
     * Fits the source element into the parent element
     * @param {Blend.ui.View/HTMLElement} parent
     * @param {Blend.ui.View/HTMLElement} child
     */
    fit: function (parent, child) {
        var me = this,
                parentElement = me.getEl(parent),
                childElement = me.getEl(child);
        Blend.CSS.set(childElement, Blend.cssPrefix('fitable'));
        Blend.Style.set(childElement, Blend.Element.getSize(parentElement));
    },
    /**
     * Center a HTMLElement only on the horizontal axis of its parent element
     * @param {HTMLElement} parent
     * @param {HTMLElement} child
     */
    centerX: function (parent, child) {
        var me = this;
        me.center(parent, child, false, true);
    },
    /**
     * Center a HTMLElement only on the vertical axis of its parent element
     * @param {HTMLElement} parent
     * @param {HTMLElement} child
     */
    centerY: function (parent, child) {
        var me = this;
        me.center(parent, child, true, false);
    },
    /**
     * Center a HTMLElement both on horizontal and vertical axis of its parent element
     * @param {HTMLElement} parent
     * @param {HTMLElement} child
     * @param {boolean} doTop
     * @param {boolean} doLeft
     */
    center: function (parent, child, doTop, doLeft) {
        if (Blend.isNullOrUndef(doTop)) {
            doTop = true;
        }
        if (Blend.isNullOrUndef(doLeft)) {
            doLeft = true;
        }
        var me = this,
                parentElement = me.getEl(parent),
                childElement = me.getEl(child),
                pb = Blend.Element.getBounds(parentElement),
                cb = Blend.Element.getBounds(childElement),
                left = doLeft ? (pb.width / 2) - (cb.width / 2) : cb.left,
                top = doTop ? (pb.height / 2) - (cb.height / 2) : cb.top;
        Blend.Element.setPosition(childElement, top, left);
    },
    /**
     * @private
     */
    getEl: function (view) {
        return view.getElement ? view.getElement() : view;
    }
}, function (clazz) {
    Blend.LayoutUtil = clazz;
});
