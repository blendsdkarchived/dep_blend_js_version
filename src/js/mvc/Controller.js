/**
 * @link http://www.blendjs.com/
 * @copyright Copyright (c) 2014 TrueSoftware B.V.
 * @license http://www.blendjs.com/license/
 */

/**
 * This class can be used to derive controller classes that can be used to
 * controll UI and other component behaviours.
 */
Blend.defineClass('Blend.mvc.Controller', {
    extend: 'Blend.utils.Referable',
    requires: [
        'Blend.mvc.Context',
        'Blend.mvc.Model'
    ],
    models: null,
    /**
     * @private
     * The context id of the mvc context hosting this controller
     */
    mvcContextId: null,
    /**
     * Runs a function that is delegated for an object reference.
     * @param {string} ref name ofthe reference
     * @param {string} handler name of the handler (click,dag...)
     * @param {object[]} args arguments to pass to the handler
     * @private
     */
    delegate: function (ref, handler, args) {
        var me = this;
        var refObj = me[ref] || null;
        if (Blend.isObject(refObj)) {
            var refHandler = refObj[handler] || null;
            if (Blend.isObject(refObj) && Blend.isFunction(refHandler)) {
                setTimeout(function () {
                    refHandler.apply(me, args);
                }, 3);
            }
        }
    },
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.models = me.models || {};
        if (!me.mvcContextId) {
            throw new Error("This controller is not in any MVC context. Are you trying to instantiate this controller manually?");
        }
        me.initModels();
    },
    initModels: function () {
        /**
         * There can only be one instance of a model with a context (application or window).
         * Therefore models will be registered and/or referenced within the application/window itself
         */
        var me = this,
                context = me.getContext();
        Blend.foreach(me.models, function (model, name) {
            if (context.hasModel(name)) {
                me.models[name] = context.getModel(name);
            } else {
                me.models[name] = context.setModel(name, Blend.create(model));
            }
        });
    },
    getContext: function () {
        return Blend.mvc.Context.getContext(this.mvcContextId);
    }
});

