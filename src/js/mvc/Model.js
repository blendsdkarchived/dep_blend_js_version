Blend.defineClass('Blend.mvc.Model', {
    fields: null,
    bindings: null,
    composites: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.fields = me.fields || [];
        me.bindings = {};
        me.composites = me.composites || {};
        me.initFields();
        delete(me.fields);
    },
    setData: function (data) {
        var me = this, setter;
        if (Blend.isObject(data)) {
            Blend.foreach(data, function (value, field) {
                setter = me['set' + Blend.camelCase(field)];
                if (Blend.isFunction(setter)) {
                    setter.apply(me, [value]);
                }
            });
        }
    },
    addBinding: function (field, handler, scope) {
        var me = this, composite, cfn;
        if (!me.bindings[field]) {
            me.bindings[field] = [];
        }
        if (me.composites[field]) {
            composite = me.composites[field];
            composite.getter = composite.getter || function () {

            };
            composite.bindTo = Blend.wrapInArray(composite.bindTo || []);
            Blend.foreach(composite.bindTo, function (field) {
                cfn = function () {
                    return handler.apply(scope, [composite.getter.apply(me)]);
                };
                me.addBinding(field, cfn, scope);
            });
        } else {
            me.bindings[field].push({
                fn: handler,
                scope: scope
            });
        }
    },
    onPropertyChanged: function (field, newValue) {
        var me = this, handlers;
        if (me.bindings[field]) {
            handlers = me.bindings[field];
            Blend.foreach(handlers, function (binding) {
                binding.fn.apply(binding.scope, [newValue]);
            });
        }
    },
    initFields: function () {
        var me = this, setterName, getterName;
        me.data = {};
        Blend.foreach(me.fields, function (field) {
            setterName = 'set' + Blend.camelCase(field);
            getterName = 'get' + Blend.camelCase(field);
            me.data[field] = null;
            me[setterName] = function (value) {
                me.data[field] = value;
                me.onPropertyChanged(field, value);
            };
            me[getterName] = function () {
                return me.data[field];
            };
        });
    }
});
