Blend.defineClass('Blend.mvc.Application', {
    requires: [
        'Blend.mvc.Controller',
        'Blend.Environment'
    ],
    mixins: {
        mvcProvider: 'Blend.mvc.Provider',
        mvcConsumer: 'Blend.mvc.Consumer'
    },
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.reference = "application";
        me.mixins.mvcProvider.init.apply(me, arguments);
        me.mixins.mvcConsumer.init.apply(me, arguments);
    },
    run: function () {
        var me = this;
        me.notifyReady();
    },
    notifyReady: function () {
        var me = this;
        me.fireEvent('ready');
    }
});