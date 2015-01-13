Blend.defineClass('Blend.ui.View', {
    extend: 'Blend.mvc.View',
    element: null,
    getElement: function () {
        var me = this;
        if (!me._rendered) {
            me.render();
            me._rendered = true;
        }
        return me.element;
    },
    render: function () {
        var me = this,
                el = me.initElement(me.element);
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