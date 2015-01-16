/**
 * This class provides utility and helper functions when running a BlendJS
 * application in the Browser,Tablet, or a Smartphone
 */
Blend.defineClass('Blend.Environment', {
    requires: [
        'Blend.dom.Dom',
        'Blend.utils.String'
    ],
    statics: {
        ORIENTATION_DEFAULT: 'D',
        ORIENTATION_LANDSCAPE: 'L',
        ORIENTATION_PORTRAIT: 'P'
    },
    singleton: true,
    /**
     * Default CSS prefix in BlendJS
     */
    CSS_PREFIX: 'b-',
    /**
     * The default uiType that is set by {Blend.web.Application} or {Blend.touch.Application}
     * This value is used internally for instantiating objects using their alias names.
     * @type {string} uiType
     */
    uiType: null,
    /**
     * Readonly property to indicating if the current browser is Internet Explorer
     * @type {Boolean}
     */
    isIE: null,
    /**
     * Readonly property providing the version, set only when the current browser
     * is Internet Explorer
     * @returns {Boolean}
     */
    IEVersion: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.id();
        me.cssPrefix();
        me.ready(function () {
            me.prepareDocumentElement();
        });
    },
    /**
     * Sets the correct properties to the document element (HTML)
     */
    prepareDocumentElement: function () {
        var el = Blend.dom.Dom.getDocument();
        Blend.CSS.set(el, Blend.cssPrefix('blend'));
    },
    /**
     * Adds an event listener to a DOM element
     * @param {Element} el
     * @param {String} eventName
     * @param {Function} eventHandler
     */
    addEventListener: function (el, eventName, eventHandler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, eventHandler, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + eventName, eventHandler);
        }
    },
    /**
     * Removes an event listener from a DOM element
     * @param {Element} el
     * @param {String} eventName
     * @param {Function} eventHandler
     */
    removeEventListener: function (el, eventName, eventHandler) {
        if (el.removeEventListener) {
            el.removeEventListener(eventName, eventHandler, false);
        }
        if (el.detachEvent) {
            el.detachEvent('on' + eventName, eventHandler);
        }
    },
    /**
     * Registers a function as a callback that will be called when the document is ready
     * @param {Function} callback The callback function to run
     * @param {Object} scope The scope in which to run the callback. Defaults to Blend itself
     */
    ready: function (callback, scope) {
        var me = this;
        if (!me.readyCallbacks) {
            me.readyCallbacks = [];
        }
        me.readyCallbacks.push({
            fn: callback,
            sc: scope || me
        });
    },
    /*
     * Internal function for detecting the browser
     * The browser detection is only used to browser version checking.
     */
    detectBrowser: function () {
        var me = this,
                browser = navigator.userAgent.toLowerCase(),
                msie = ((/msie (\d+)/.exec(browser) || [])[1]);
        if (Blend.isNullOrUndef(msie)) {
            msie = ((/trident\/.*; rv:(\d+)/.exec(browser) || [])[1]);
        }

        me.isIE = !Blend.isNullOrUndef(msie);
        if (me.isIE) {
            me.IEVersion = parseInt(msie);
        } else {
            me.IEVersion = null;
        }
    },
    /**
     * An alternative to {Blend.Environment.kickStart} that can be used to kickstart an application.
     * @param {String} applicationClass A class that is derived from {Blend.web.Application}
     * or {Blend.touch.Appliction}
     */
    runApplication: function (applicationClass) {
        var me = this, appStart = function () {
            var app = Blend.create(applicationClass);
            if (Blend.isInstanceOf(app, Blend.mvc.Application)) {
                app.start();
            } else {
                throw new Error(applicationClass + " does not seem to be a Blend.core.Application instance");
            }
        };
        if (me.kickStarted) {
            appStart.apply(me, arguments);
        } else {
            me.ready(appStart);
        }
        me.kickStart();
    },
    /**
     * Checks if the probwer has certain capabilities to continue.
     * If the running browser is outdated to does not support certain
     * functions then Blend simply will not start!
     * @return {boolean}
     */
    isBrowserOK: function () {
        var me = this;
        if (me.isIE && me.IEVersion < 9) {
            document.write('Unable to tun this application! Please upgreade your outdated browser');
            return false;
        } else {
            return true;
        }
    },
    /**
     * Initiates Blend's application lifecycle by executing the callbacks
     * which are registered by {Environment.ready}
     */
    kickStart: function () {
        var me = this,
                didRun = false,
                doCallback = function () {
                    if (didRun === false) {
                        didRun = true;
                        if (me.isBrowserOK()) {
                            Blend.foreach(me.readyCallbacks, function (item) {
                                setTimeout(function () {
                                    item.fn.apply(item.sc, []);
                                }, 1);
                            });
                        }
                    }
                }

        if (!me.kickStarted) {
            me.kickStarted = true;
            me.detectBrowser();
            if (document.readyState === "complete") {
                setTimeout(doCallback, 5);
            } else {
                me.addEventListener(document, 'DOMContentLoaded', doCallback);
                me.addEventListener(window, 'load', doCallback);
            }
        }
    },
    /**
     * Generates an unique id to be used as class a identifier. This function is
     * available as Blend.id(...)
     * @returns {number} Returns a new unique id withing the current application.
     */
    id: function () {
        var me = this;
        Blend.id = function () {
            if (!me.$id) {
                me.$id = 1;
            }
            return 'b' + (me.$id++);
        };
    },
    cssPrefix: function () {
        var me = this;
        Blend.cssPrefix = function (className) {
            var r = [];
            className = Blend.wrapInArray(className);
            Blend.foreach(className, function (itm) {
                r.push(me.CSS_PREFIX + itm);
            });
            return r;
        };
    },
    /**
     * Check if the current browser environment is a Mobile device
     * @returns {Boolean}
     */
    isMobileDevice: function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * Gets the orientation of current window or device
     * @returns {Blend.Environment.ORIENTATION_LANDSCAPE|Blend.Environment.ORIENTATION_PORTRAIT|Blend.Environment.ORIENTATION_DEFAULT}
     */
    getOrientation: function () {
        var me = this;
        if (me.isMobileDevice()) {
            if (window.innerWidth >= window.innerHeight) {
                return Blend.Environment.ORIENTATION_LANDSCAPE;
            } else {
                return Blend.Environment.ORIENTATION_PORTRAIT;
            }
        } else {
            return Blend.Environment.ORIENTATION_DEFAULT;
        }
    },
    /**
     * Gets the size of window or device
     * @returns {object}
     */
    getSize: function () {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
}, function () {
    Blend.foreach(Blend.CSS, function (v, k) {
        if (k.startsWith('CSS_')) {
            Blend.CSS[k] = Blend.cssPrefix(v).join('');
        }
    });
});