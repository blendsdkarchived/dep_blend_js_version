Blend.defineClass('Blend.ui.View', {
    extend: 'Blend.mvc.View',
    element: null,
    init: function () {
        var me = this;
        me._rendered = false;
        me._layout = true;
        me.callParent.apply(me, arguments);
    },
    getElement: function () {
        var me = this;
        if (!me._rendered) {
            me.render();
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
    },
    render: function () {
        var me = this,
                el = me.initElement(me.element || {});
        el = Blend.Element.create(el, function (oid, element) {
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
        return (me.element = me.finalizeRender(el));
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
    finalizeRender: function (el) {
        return el;
    }
});