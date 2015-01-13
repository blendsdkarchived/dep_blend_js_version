Blend.defineClass('Blend.layout.Util', {
    singleton: true,
    /**
     * Fits the source element into the parent element
     * @param {HTMLElement} sourceElement
     * @param {HTMLElement} destElement
     */
    fit: function (parentElement, childElement) {
        var pSize;
        Blend.CSS.set(childElement, Blend.cssPrefix('fitable'));
        if (parentElement === window) {
            pSize = {
                width: window.innerWidth,
                height: window.innerHeight
            }
        } else {
            pSize = Blend.Element.getSize(parentElement);
        }
        Blend.Style.set(childElement, pSize);
    }
}, function (clazz) {
    Blend.LayoutUtil = clazz;
});
