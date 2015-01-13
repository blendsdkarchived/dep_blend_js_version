Blend.defineClass('Blend.mvc.Bindable', {
    bind: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.bind = me.bind || {};
        if (Blend.isObject(me.bind) && me.mvcContextId) {
            me.initBindings();
        }
    },
    initBindings: function () {
        var me = this;
        Blend.foreach(me.bind, function (modProp, property) {
            me.addBinding(property, modProp);
        });
    },
    addBinding: function (prop, modProp) {
        modProp = modProp || "";
        prop = prop || null;
        var me = this,
                m = modProp.split('.'),
                context, model, setter;
        if (prop && m.length === 2) {
            context = me.getContext(me.mvcContextId);
            model = context.getModel(m[0]);
            if (model) {
                if (model.hasField(m[1])) {
                    setter = me.getSetterForProperty(prop);
                    if (setter) {
                        model.addBinding(m[1], setter, me);
                    } else {
                        throw new Error('Unable to bind ' + prop + ' to ' + modProp + ' due missing a setter for ' + prop);
                    }
                } else {
                    throw new Error('Model ' + m[0] + ' does not have a field or a compisute field called: ' + m[1]);
                }
            } else {
                throw new Error('Undefined model:' + m[0]);
            }
        }
    },
    getSetterForProperty: function (name) {
        var me = this, setterName = 'set' + Blend.camelCase(name);
        if (Blend.isFunction(me[setterName])) {
            return me[setterName];
        } else {
            return null;
        }
    }
});