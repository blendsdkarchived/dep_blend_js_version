Blend.defineClass('Blend.mvc.Provider', {
    requires: [
        'Blend.mvc.Context'
    ],
    ctxControllers: null,
    /**
     * The MVC context id that is set at {Blend.mvc.Context.addContext}
     */
    mvcContextId: null,
    getModel: function (name) {
        var me = this;
        return me._models[name];
    },
    setModel: function (name, model) {
        var me = this;
        me._models[name] = model;
        return model;
    },
    hasModel: function (name) {
        var me = this;
        return me._models[name] ? true : false;
    },
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.ctxControllers = {};
        me._models = {};
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
