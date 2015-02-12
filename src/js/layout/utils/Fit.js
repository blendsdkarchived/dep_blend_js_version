/**
 * Layout utility class for fitting HTMLElements into a parent HTMLElement
 */
Blend.defineClass('Blend.layout.utils.Fit', {
    extend: 'Blend.layout.utils.Util',
    singleton: true,
    /**
     * Fits the source element into the parent element
     * @param {Blend.ui.View/HTMLElement} parent
     * @param {Blend.ui.View/HTMLElement} child
     */
    fit: function (parent, child, lctx, borderSize) {
        var me = this,
                parentElement = me.getEl(parent),
                childElement = me.getEl(child);
        borderSize = Blend.Style.get(parentElement, 'border') || 0;
        Blend.CSS.set(childElement, Blend.cssPrefix('fitable'));
        var bounds = Blend.Element.getSize(parentElement);

        if (borderSize !== 0) {
            bounds.width -= (borderSize * 2);
            bounds.height -= (borderSize * 2);
        }

        if (lctx && lctx.handler) {
            lctx.handler(childElement, bounds);
        } else {
            Blend.Style.set(childElement, bounds);
        }
    }
});