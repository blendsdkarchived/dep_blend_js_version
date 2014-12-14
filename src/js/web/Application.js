Blend.defineClass('Blend.web.Application', {
    extend: 'Blend.mvc.Application',
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        Blend.Environment.uiType = 'webui';
    }
});

