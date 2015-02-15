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
     * @param {object} lctx
     */
    fit: function (parent, child, lctx) {
        var me = this,
                parentElement = me.getEl(parent),
                childElement = me.getEl(child),
                parSpacing = Blend.Element.getSpacing(parentElement);
        var bounds = Blend.Element.getInnerSize(parentElement);
        if (lctx && lctx.handler) {
            lctx.handler(childElement, bounds);
        } else {
            Blend.Style.set(childElement, bounds);
        }
    }
});