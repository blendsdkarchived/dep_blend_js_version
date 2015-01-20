/**
 * Utility class providing functionality to manipulate the CSS class attribute
 * of a DOM element. This class is available utils {Blend.CSS} shorthand
 */
Blend.defineClass('Blend.dom.CSS', {
    singleton: true,
    CSS_HIDDEN: 'hidden',
    CSS_SCROLL_X: 'xscroll',
    CSS_SCROLL_Y: 'yscroll',
    CSS_SCROLL_NONE: 'noscroll',
    CSS_SCROLL_AUTO: 'autoscroll',
    /**
     * Checks if the DOM element has a css class
     * @param {HTMLElement} el the html element
     * @param {strin/array[]} cls an array of string or a single string.
     */
    has: function (el, cls) {
        if (Blend.isString(el)) {
            el = Blend.get(el);
        }
        if (el) {
            if (Blend.isArray(cls)) {
                var r = {};
                Blend.foreach(cls, function (itm) {
                    r[itm] = el.$$.cls.indexOf(itm) !== -1;
                });
                return r;
            } else {
                return el.$$.cls.indexOf(cls) !== -1;
            }
        }
        return false;
    },
    /**
     * Clear all the classes from a DOM element
     */
    clear: function (el) {
        if (Blend.isString(el)) {
            el = Blend.get(el);
        }
        if (el) {
            el.$$.cls = [];
            el.removeAttribute('class');
        }
        return el;
    },
    /**
     * Toggles one or more classes on the DOM element
     * @param {HTMLElement} el the html element
     * @param {string/array[]) cls an array of string or a single string.
     */
    toggle: function (el, cls) {
        return this.proc(el, cls, 't');
    },
    /**
     * Unset one or more classes on the DOM element
     * @param {HTMLElement} el the html element
     * @param {string/array[]) cls an array of string or a single string.
     */
    unset: function (el, cls) {
        return this.proc(el, cls, 'u');
    },
    /**
     * Sets one or more classes on the DOM element
     * @param {HTMLElement} el the html element
     * @param {string/array[]) cls an array of string or a single string.
     */
    set: function (el, cls) {
        return this.proc(el, cls, 's');
    },
    /**
     * Internal private for handling set and unset.
     * @private
     */
    proc: function (el, cls, cmd) {
        if (Blend.isString(el)) {
            el = Blend.get(el);
        }
        if (el) {
            if (Blend.isString(cls) && cls !== "") {
                cls = cls.split(' ');
            }
            if (cmd === 's') {
                Blend.foreach(cls, function (itm) {
                    if (el.$$.cls.indexOf(itm) === -1) {
                        el.$$.cls.push(itm);
                    }
                });
            } else if (cmd === 'u') {
                var i;
                Blend.foreach(cls, function (itm) {
                    if ((i = el.$$.cls.indexOf(itm)) !== -1) {
                        el.$$.cls.splice(i, 1);
                    }
                });
            } else if (cmd === 't') {
                var i;
                Blend.foreach(cls, function (itm) {
                    if ((i = el.$$.cls.indexOf(itm)) === -1) {
                        el.$$.cls.push(itm);
                    } else {
                        el.$$.cls.splice(i, 1);
                    }
                });
            }
            var res = el.$$.cls.join(' ');
            if (res !== "") {
                el.setAttribute('class', res);
            } else if (res === "") {
                el.removeAttribute('class');
            }
        }
        return el;
    }
}, function (clazz) {
    Blend.CSS = clazz;
});


