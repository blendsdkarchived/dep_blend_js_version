/**
 * Utility class providing functionality to manipulate a DOM element
 */
Blend.defineClass('Blend.dom.Element', {
    singleton: true,
    requires: [
        'Blend.dom.Style'
    ],
    /**
     * Clears the contents of the given element.
     * @param {HTMLElement} el th element to hide
     */
    clear: function (el) {
        var me = this;
        if (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }
    },
    /**
     * Creates an {HTMLElement} based on an element speficication
     * @param {object} specs the element speficication
     * @param {function} callback callback function that is used to identify
     * specific child DOM elements
     */
    create: function (specs, callback, eventScope) {

        var me = this,
                el = Blend.dom.Dom.initEl(document.createElement(specs.type || specs.tag || 'div'));
        Blend.foreach(specs, function (value, key) {
            if (typeof (value) === 'function') {
                value = value.apply(eventScope, arguments);
            }
            if (key === 'unselectable' && value === true) {
                value = "on";
            }
            if (key === 'cls') {
                if (Blend.isArray(value)) {
                    value = value.join(' ');
                }
                Blend.CSS.set(el, value);
            } else if (key === 'style') {
                Blend.Style.set(el, value);
            } else if (key === 'items') {
                if (!Blend.isArray(value)) {
                    value = [value];
                }
                Blend.foreach(value, function (item) {
                    if (Blend.isInstanceOf(item, HTMLElement)) {
                        el.appendChild(item);
                    } else {
                        el.appendChild(me.create(item, callback, eventScope));
                    }
                });
            } else if (key === 'listeners') {
                Blend.foreach(value, function (fn, evt) {
                    var handler = function () {
                        eventScope = eventScope || this;
                        fn.apply(eventScope, arguments);
                    };
                    Blend.addEventListener(el, evt, handler);
                });
            } else if (key === 'text') {
                el.textContent = value;
            } else if (key !== 'tag' && key !== 'oid' && key !== 'type') {
                el.setAttribute(key, value);
            }
        });
        if (specs.oid && callback) {
            callback(specs.oid, el);
        }
        return el;
    },
    /**
     * Makes the DOM element hidden
     * @param {HTMLElement} el th element to hide
     */
    hide: function (el) {
        Blend.Style.set(el, 'display', 'none');
    },
    /**
     * Makes the DOM element visible
     * @param {HTMLElement} el th element to show
     */
    show: function (el) {
        Blend.Style.unset(el, 'display');
    },
    /**
     * Checks if en element is visible
     * @returns {boolean} true if the element is visible, otherwise it returns
     * false
     */
    isVisible: function (el) {
        if (el && el.style) {
            if (el.style.display) {
                return el.style.display !== 'none';
            } else {
                return true;
            }
        }
    },
    /**
     * destroys an HTMLElement by removing it from the DOM
     */
    destroy: function (el) {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    },
    /**
     * Get the margins of a given element
     * @param {HTMLElement} el
     * @returns {object} As {top:#,bottom:#,left:#,right#}
     */
    getMargins: function (el) {
        var r = {}, t = Blend.Style.get(el, ['margin-top', 'margin-bottom', 'margin-left', 'margin-right']);
        Blend.foreach(t, function (v, k) {
            r[k.replace('margin-', '')] = v;
        })
        return r;
    },
    /**
     * Get the width and the height of an element
     */
    getSize: function (el) {
        return Blend.Style.get(el, ['width', 'height']);
    },
    /**
     * Clone an element
     * @param {boolean} deep true if the children of the node should also be cloned
     * or false to clone only the specified node, defaults to true
     */
    clone: function (el, deep) {
        deep = deep || true;
        return  Blend.dom.Dom.initEl(el.cloneNode(deep));
    },
    /**
     * Gets the position and the size of an element [top,left,width,height]
     * as an object.
     */
    getSizeAndPosition: function (el) {
        return Blend.Style.get(el, ['width', 'height', 'top', 'left']);
    }
}, function (clazz) {
    Blend.Element = clazz;
});