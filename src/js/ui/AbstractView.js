Blend.defineClass('Blend.ui.AbstractView', {
    extend: 'Blend.mvc.View',
    requires: [
        'Blend.layout.Layout'
    ],
    element: null,
    layoutContext: null,
    init: function () {
        var me = this;
        me._rendered = false;
        me._layout = true;
        me.callParent.apply(me, arguments);
        me.layout = me.layout || 'base';
        me.initLayout();
    },
    setLayoutContext: function (ctx) {
        var me = this;
        me.layoutContext = ctx;
    },
    /**
     * @private initializes the layout object for this view
     * @returns {undefined}
     */
    initLayout: function () {
        var me = this;
        me.layout = Blend.layout.Layout.createLayout(me, me.layout);
    },
    getElement: function () {
        var me = this;
        if (!me._rendered) {
            /**
             * We do this to be able to pass a renderContext without the need
             * to explicitly defining the function parameters
             */
            me.render.apply(me, arguments);
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
    performLayout: function () {
        var me = this;
        if (me.canLayout()) {
            me._layout = false;
            me.layoutView();
            me._layout = true;
        }
    },
    layoutView: function () {
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
        /**
         * Ini the element
         */
        el = Blend.apply(el || {}, {
            style: {},
            cls: []
        }, false, true);
        return el;
    },
    finalizeRender: function (setterMap) {
        var me = this, setterFn;
        setterMap = setterMap || {};
        me.disableEvents();
        Blend.foreach(setterMap, function (setter, config) {
            me[setter].apply(me, [me[config]]);
        });
        Blend.foreach(me, function (value, config) {
            setterFn = me['set' + Blend.camelCase(config)];
            if (!Blend.isFunction(value) && Blend.isFunction(setterFn)) {
                setterFn.apply(me, [value]);
            }
        });
        me.enableEvents();
    }
});