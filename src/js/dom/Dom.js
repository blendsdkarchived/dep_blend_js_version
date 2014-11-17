/**
 *  A utility class providing wrapper functions for common DOM operartions.
 */
Blend.defineClass('Blend.dom.Dom', {
    singleton: true,
    requires: [
        'Blend.dom.CSS',
        'Blend.dom.Style',
        'Blend.dom.Element'
    ],
    /**
     * Initializes the element by added a meta data container.
     */
    initEl: function (el) {
        if (el && !el.$$) {
            var m = {};
            if (el.hasAttribute('class')) {
                m.cls = el.getAttribute('class').split(' ');
            } else {
                m.cls = [];
            }
            el.$$ = m;
        }
        return el;
    },
    get: function (id) {
        if (Blend.isInstanceOf(id, HTMLElement)) {
            return this.initEl(id);
        } else {
            return this.initEl(document.getElementById(id));
        }
    },
    /**
     * Gets the root document element. This going to be the HTML tag.
     * @returns {HTMLElement}
     */
    getDocument: function () {
        if (document) {
            return this.initEl(document.documentElement);
        } else {
            throw new Error('No document object available!');
        }
    },
    /**
     * Gets the window object
     * @returns {Window} the browser window object
     */
    getWindow: function () {
        if (window) {
            return window;
        } else {
            throw new Error('No browser window object available!');
        }
    },
    /**
     * Gets the BODY element of a page
     * @returns {HTMLElement} the BODY tag of the current page
     */
    getBody: function () {
        if (document && document.body) {
            return this.initEl(document.body);
        } else {
            return null;
        }
    },
    createDocumentFragment: function () {
        return document.createDocumentFragment();
    }
}, function (clazz) {
    Blend.get = function (id) {
        return clazz.get(id);
    };
    Blend.getBody = function () {
        return clazz.getBody();
    };
    Blend.getDocument = function () {
        return clazz.getDocument();
    };
    Blend.createDocumentFragment = function () {
        return clazz.createDocumentFragment();
    };
});