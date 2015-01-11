Blend.defineClass('Blend.mvc.Consumer', {
    requires: [
        'Blend.mvc.Context'
    ],
    /**
     * List of controllers that this consumer is communicating to
     */
    controllers: null,
    mvcContextId: null,
    reference: null,
    init: function () {
        var me = this, cs = [];
        me.callParent.apply(me, arguments);
        me.initContext();
    },
    /**
     * Initializes this consumers MVC context
     */
    initContext: function () {
        var me = this;
        /**
         * [1] if this consumer does not have a reference then there is no need to
         * put it in any MVC context.
         *
         * [2] The consumer can have a reference but no controllers defined. In this
         * case we need to travel the parent chain until be find a parent that
         * has a controller array defined.
         *
         * [3] The consumer has both reference and controllers. In this case we need
         * to ask the provider to either create and register those controllers
         * or return an ref name to that controller but this is not done here since
         * we lazy initialize controllers. The controller initialization is done
         * in the fireEvent method.
         */

        /**
         * Make an array if possible
         */
        if (Blend.isString(me.controllers)) {
            me.controllers = Blend.wrapInArray(me.controllers);
        } else if (!me.hasControllers()) {
            /**
             * Empty controller array are equal to no controllers.
             */
            me.controllers = null;
        }

        // check [1]
        if (!Blend.isNullOrUndef(me.reference) && Blend.isNullOrUndef(me.controllers)) {
            var parent = null, cmp = me;
            /**
             * Find and set controllers for this consumer
             */
            while ((parent = cmp.parent || null) !== null) {
                if (parent.hasControllers()) {
                    me.controllers = parent.controllers;
                    break;
                }
                cmp = parent;
            }
        }
        if (Blend.isArray(me.controllers)) {
            /**
             * Set a reference for this consumer in the controller
             */
            Blend.foreach(me.controllers, function (controller) {
                Blend.mvc.Context.getMVCContext(me.mvcContextId).getController(controller).setReference(me.reference, me);
            });
        }
    },
    hasControllers: function () {
        var me = this;
        return Blend.isArray(me.controllers) && me.controllers.length !== 0;
    },
    fireEvent: function () {
        var me = this, evt, args = [me], a, mvcContext;
        if (arguments.length !== 0 && Blend.isString(arguments[0])) {
            for (a = 0; a !== arguments.length; a++) {
                args.push(arguments[a]);
            }
            evt = arguments[0];
            Blend.foreach(me.controllers, function (controller) {
                mvcContext = Blend.mvc.Context.getMVCContext(me.mvcContextId);
                if (mvcContext) {
                    mvcContext.getController(controller).delegate(me.reference, evt, args);
                } else {
                    throw new Error('This consumer is not in any MVC provider context!');
                }
            }, me);
        } else {
            throw new Error('Invalid parameters to fire and event. The first parameter must be the name of the event and optionally followed by other paremeters.');
        }
    }
});
