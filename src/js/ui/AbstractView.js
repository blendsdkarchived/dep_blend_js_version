Blend.defineClass('Blend.ui.AbstractView', {
    extend: 'Blend.mvc.View',
    requires: [
        'Blend.layout.Layout'
    ],
    element: null,
    unselectable: true,
    init: function () {
        var me = this;
        me._rendered = false;
        me._layout = true;
        me.callParent.apply(me, arguments);
        me.layout = me.layout || 'base';
        me._layoutTriggers = me.getDefaultLayoutTriggers();
        me.initLayout();
    },
    getDefaultLayoutTriggers: function () {
        return [];
    },
    /**
     * @internal
     */
    setLayoutContext: function (ctx) {
        var me = this;
        me.layoutContext = ctx;
    },
    /**
     * @internal
     */
    getLayoutContext: function () {
        var me = this;
        return me.layoutContext;
    },
    /**
     * @private initializes the layout object for this view
     * @returns {undefined}
     */
    initLayout: function () {
        var me = this;
        me.layout = Blend.layout.Layout.createLayout(me, me.layout);
    },
    getElement: function (renderCtx) {
        var me = this;
        if (!me._rendered) {
            /**
             * We do this to be able to pass a renderContext without the need
             * to explicitly defining the function parameters
             */
            me.element = me.render.apply(me, arguments);
            me._rendered = true;
        }
        return me.element;
    },
    canLayout: function () {
        var me = this;
        return me._layout;
    },
    suspendLayout: function () {
        var me = this;
        me._layout = false;
    },
    resumeLayout: function () {
        var me = this;
        me._layout = true;
        me.layoutView();
    },
    performLayout: function (force) {
        var me = this;
        if (me.canLayout()) {
            me._layout = false;
            me.layoutView.apply(me, arguments);
            me._layout = true;
        }
    },
    layoutView: function (force) {
        var me = this;
        me.layout.performLayout.apply(me.layout, arguments);
    },
    render: function (renderCtx) {
        var me = this,
                el = me.initElement(me.element || {});
        el = Blend.Element.create(Blend.apply(el, renderCtx || {}, false, true), function (oid, element) {
            /**
             * Check if we can find a setter for the oid and if possible assign
             * the element using the setter.
             */
            var setterName = 'set' + Blend.camelCase(oid);
            if (Blend.isFunction(me[setterName])) {
                me[setterName].apply(me, [element]);
            } else {
                me[oid] = element;
            }
        }, me);
        me.element = el;
        me.finalizeRender({});
        return me.element;
    },
    initElement: function (el) {
        var me = this;
        /**
         * Ini the element
         */
        el = Blend.apply(el || {}, {
            style: {},
            cls: []
        }, false, true);
        if (me.unselectable) {
            el.unselectable = "on";
        }
        return el;
    },
    finalizeRender: function (setterMap) {
        var me = this, setterFn, ival;
        setterMap = setterMap || {};
        me.disableEvents();
        Blend.foreach(setterMap, function (setter, config) {
            ival = me[config];
            me[config] = null;
            me[setter].apply(me, [ival]);
        });
        Blend.foreach(me, function (value, config) {
            setterFn = me['set' + Blend.camelCase(config)];
            if (!Blend.isFunction(value) && Blend.isFunction(setterFn)) {
                me[config] = null;
                setterFn.apply(me, [value]);
            }
        });
        me.enableEvents();
    },
    /**
     * @private
     */
    fireEvent: function () {
        var me = this, args = [];
        Blend.foreach(arguments, function (arg) {
            args.push(arg);
        });
        var evtFired = me.callParent.apply(me, args);
        if (evtFired && me._layoutTriggers.indexOf(evtFired) !== -1) {
            if (me.parent) {
                me.parent.performLayout(true);
            }
        }
        return evtFired;
    }
});