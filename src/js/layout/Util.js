Blend.defineClass('Blend.layout.Util', {
    singleton: true,
    /**
     * Fits the source element into the parent element
     * @param {HTMLElement} sourceElement
     * @param {HTMLElement} destElement
     */
    fit: function (parentElement, childElement) {
        Blend.CSS.set(childElement, Blend.cssPrefix('fitable'));
        Blend.Style.set(childElement, Blend.Element.getSize(parentElement));
    }
}, function (clazz) {
    Blend.LayoutUtil = clazz;
});
