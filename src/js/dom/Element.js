/**
 * Utility class providing functionality to manipulate a DOM element
 */
Blend.defineClass('Blend.dom.Element', {
    singleton: true,
    requires: [
        'Blend.dom.Style'
    ],
    /**
     * Sets the scrol state for a HTMLElement
     * @param {boolean/string} state true/false or 'x' 'y'
     */
    scrollable: function (el, state) {
        var clearScroll = function () {
            Blend.CSS.unset(el, [
                Blend.CSS.CSS_SCROLL_X,
                Blend.CSS.CSS_SCROLL_Y,
                Blend.CSS.CSS_SCROLL_NONE,
                Blend.CSS.CSS_SCROLL_AUTO
            ]);
        };

        if (el && !Blend.isNullOrUndef(state)) {
            clearScroll();
            if (state === true) {
                state = Blend.CSS.CSS_SCROLL_AUTO;
            } else if (state === false) {
                state = Blend.CSS.CSS_SCROLL_NONE;
            } else if (state === 'x') {
                state = Blend.CSS.CSS_SCROLL_X;
            } else if (state === 'y') {
                state = Blend.CSS.CSS_SCROLL_Y;
            }
            Blend.CSS.set(el, state);
        }
    },
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
                    Blend.Environment.addEventListener(el, evt, handler);
                });
            } else if (key === 'text') {
                el.textContent = value;
            } else if (key !== 'tag' && key !== 'oid' && key !== 'type' && key !== 'cls') {
                try {
                    el.setAttribute(key, value);
                } catch (e) {
                    e.message += key + '->' + value;
                    throw e;
                }
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
     * Sets the potition of an HTMLElement. In order for this to work correctly
     * the element must have a position:static or position:relative style
     * @param {HTMLElement} el
     * @param {number} top
     * @param {number} left
     */
    setPosition: function (el, top, left) {
        Blend.Style.set(el, {
            top: top,
            left: left
        });
    },
    /**
     * Gets the top,left,width, and the height of an HTMLElement
     * @param {HTMLElement} el
     * @returns {object}
     */
    getBounds: function (el) {
        if (el === window) {
            return  {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            }
        } else {
            return Blend.Style.get(el, ['top', 'left', 'width', 'height']);
        }
    },
    /**
     * Get the width and the height of an element
     */
    getSize: function (el) {
        if (el === window) {
            return  {
                width: window.innerWidth,
                height: window.innerHeight
            }
        } else {
            return Blend.Style.get(el, ['width', 'height']);
        }
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
    setOpacity: function (el, value) {
        value = value || 1;
        if (el) {
            Blend.Style.set(el, {
                opacity: value
            });
        }
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