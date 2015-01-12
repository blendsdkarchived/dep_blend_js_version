Blend.defineClass('Blend.mvc.Provider', {
    requires: [
        'Blend.mvc.Context'
    ],
    ctxControllers: null,
    /**
     * The MVC context id that is set at {Blend.mvc.Context.addContext}
     */
    mvcContextId: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.ctxControllers = {};
        /**
         * Add this provided to the global context registry.
         */
        Blend.mvc.Context.addContext(me);
    },
    /**
     * Retrive a controller object by its classname. If the controller object.
     * Lazy initialize the controller if needed
     */
    getController: function (cname) {
        var me = this;
        if (Blend.isString(cname)) {
            if (!me.ctxControllers[cname]) {
                me.ctxControllers[cname] = Blend.create(cname, {
                    mvcContextId: me.mvcContextId
                });
            }
            return me.ctxControllers[cname];
        } else {
            throw new Error('Invalid controller class name [' + cname + ']');
        }
    }
});
