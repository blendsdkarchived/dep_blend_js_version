/**
 * Utility class providing functionality to manipulate the style attribute
 * of a DOM element. This class is available using {Blend.Style}
 */
Blend.defineClass('Blend.dom.Style', {
    singleton: true,
    unitPropertyRe: /(width$|height$|size$|radius$|padding|margin$|top$|bottom$|right$|left$)/,
    unitTypeRe: /(em$|\%$)/,
    UNIT: 'px',
    /**
     * Removes the 'px' postfix from a given value if possible and converts it
     * to a number
     */
    fromUnit: function (value) {
        var me = this,
                v = value + ''; // force to string;
        if (v.indexOf(me.UNIT) !== -1) {
            return parseFloat(v.replace('px', ''));
        } else {
            return value;
        }
    },
    /**
     * Clear the style attribute of an element
     * @param {HTMLElement} el
     */
    clear: function (el) {
        var me = this;
        if (Blend.isString(el)) {
            el = Blend.get(el);
        }
        if (el && el.style) {
            el.removeAttribute('style');
        }
    },
    /**
     * Unset a given style of an element.
     * @param {HTMLElement} el
     * @param {string/string[]} styles a single style or array of styles to be
     * unset
     */
    unset: function (el, styles) {
        var me = this;
        if (Blend.isString(el)) {
            el = Blend.get(el);
        }
        if (el && el.style) {
            if (Blend.isArray(styles)) {
                Blend.foreach(styles, function (itm) {
                    el.style.setProperty(itm, '');
                });
                return el;
            } else {
                el.style.setProperty(styles, '');
                return el;
            }
        }
    },
    /**
     * Retrives a specific set of styles from an element as an object
     * @param {HTMLElement} el
     * @param {string/string[]} styles a single style or array of styles to be
     */
    get: function (el, styles) {
        var me = this;
        if (Blend.isString(el)) {
            el = Blend.get(el);
        }
        if (el && el.ownerDocument) {
            var cs = el.ownerDocument.defaultView.getComputedStyle(el, null);
            if (Blend.isArray(styles)) {
                var r = {};
                Blend.foreach(styles, function (itm) {
                    r[itm] = me.fromUnit(cs.getPropertyValue(itm));
                });
                return r;
            } else {
                return me.fromUnit(cs.getPropertyValue(styles));
            }
        }
    },
    /**
     * Set a specific set of styles to an element from an object or a single
     * style with a given value
     * @param {HTMLElement} el
     * @param {object/string} styles as an object (key/pair) or a single key
     * @param {string/number} value used when the "styles" parameter is a string
     */
    set: function (el, styles, value) {
        var setter = function (el, k, v) {
            if (v === null) {
                el.style.setProperty(k, '');
            } else {
                if (Blend.Environment.isIE) {
                    el.style[k] = v;
                } else {
                    el.style.setProperty(k, v);
                }
            }
        };
        var me = this;
        if (Blend.isString(el)) {
            el = Blend.get(el);
        }
        if (el) {
            if (Blend.isObject(styles)) {
                Blend.foreach(styles, function (v, k) {
                    if (me.unitPropertyRe.test(k) && !me.unitTypeRe.test(v)) {
                        v = v + me.UNIT;
                    }
                    setter(el, k, v);
                });
            } else {
                setter(el, styles, value);
            }
        }
        return el;
    }
}, function (clazz) {
    Blend.Style = clazz;
});


