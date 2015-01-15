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
    center: function (parent, child) {
        var me = this,
                parentElement = me.getEl(parent),
                childElement = me.getEl(child),
                pb = Blend.Element.getBounds(parentElement),
                cb = Blend.Element.getBounds(childElement),
                left = (pb.width / 2) - (cb.width / 2),
                top = (pb.height / 2) - (cb.height / 2)
        Blend.Element.setPosition(childElement, top, left);
    },
    getEl: function (view) {
        return view.getElement ? view.getElement() : view;
    }
}, function (clazz) {
    Blend.LayoutUtil = clazz;
});
