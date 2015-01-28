Blend.defineClass('Blend.mvc.View', {
    extend: 'Blend.mvc.Consumer',
    mixins: {
        bindable: 'Blend.mvc.Bindable',
        referable: 'Blend.utils.Referable'
    },
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.mixins.bindable.init.apply(me, arguments);
        me.mixins.referable.init.apply(me, arguments);
    }
});