Blend.defineClass('Blend.mvc.View', {
    extend: 'Blend.mvc.Consumer',
    mixins: {
        bindable: 'Blend.mvc.Bindable'
    },
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.mixins.bindable.init.apply(me, arguments);
    }
});