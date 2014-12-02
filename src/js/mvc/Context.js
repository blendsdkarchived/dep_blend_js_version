/**
 * Singleton class providing a global space for registering MVC contexts
 * This object is automatically instantiated from Blend.mvc.* classes
 */
Blend.defineClass('Blend.mvc.Context', {
    singleton: true,
    /**
     * Retuns an mvc context by its context id.
     * @param {string} contextId The context id of the mvc context to be returned
     */
    getMVCContext: function (contextId) {
        var me = this;
        if (me.mvcContext) {
            return me.mvcContext[contextId];
        } else {
            return null;
        }
    },
    /**
     * Registers a new mvc context
     * @param {Blend.mvc.Provider} context The context to be
     * registered
     */
    addMVCContext: function (context) {
        var me = this;
        if (!me.mvcContext) {
            me.mvcContext = {};
        }
        context.mvcContextId = Blend.id();
        me.mvcContext[context.mvcContextId] = context;
    }
});


