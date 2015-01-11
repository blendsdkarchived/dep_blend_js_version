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
    requires: [
        'Blend.mvc.Context',
        'Blend.mvc.Model'
    ],
    refs: null,
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
    /**
     * Gets the reference to an object from a component or a view. This function
     * will either return a single object or an array of objects if there are
     * multiple object with the same reference name.
     * @param {string} refName name of the reference to search.
     * @return {object/object[]} A single object or an array of objects.
     */
    getReference: function (refName) {
        var me = this;
        if (me.refs[refName]) {
            if (me.refs[refName].length === 1) {
                return me.refs[refName][0];
            } else {
                return me.refs[refName];
            }
        } else {
            return null;
        }
    },
    /**
     * Sets the reference of a component in this controller. This function is
     * internal and should not be used, unless you are absolutely sure of what
     * you are doing. When a reference for component is set, this class automatically
     * will try to create a getter function for the given component. For example if set the
     * a component by refName="text", a function that is called getText(...) will automatically
     * be created in this controller. This function optionally consumes a filter callback
     * that can be used to filter a result of the getter function when the getter returns an
     * array of objects.
     * @private
     * @param {string} refName the name of the reference.
     * @param {object} obj The object to create the refenece for.
     */
    setReference: function (refName, obj) {
        var me = this, getterName, filter;
        if (!me.refs[refName]) {
            getterName = 'get' + Blend.camelCase(refName);
            me[getterName] = function (filter) {
                filter = Blend.isFunction(filter) ? filter : function () {
                    return arguments;
                };
                var values = me.getReference(refName);
                if (Blend.isArray(values)) {
                    return filter.apply(me, [values]);
                } else {
                    return values;
                }
            }
            me.refs[refName] = [obj];
        } else {
            me.refs[refName].push(obj);
        }
    },
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.refs = {};
        if (!me.mvcContextId) {
            throw new Error("This controller is not in any MVC context. Are you trying to instantiate this controller manually?");
        }
    },
    getMVCContext: function () {
        return Blend.mvc.Context.getMVCContext(this.mvcContextId);
    }
});

