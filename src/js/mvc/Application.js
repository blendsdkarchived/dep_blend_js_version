Blend.defineClass('Blend.mvc.Application', {
    requires: [
        'Blend.mvc.Controller',
        'Blend.Environment',
        'Blend.ui.View',
    ],
    mixins: {
        mvcProvider: 'Blend.mvc.Provider',
        mvcConsumer: 'Blend.mvc.Consumer'
    },
    mainView: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.reference = "application";
        me.mixins.mvcProvider.init.apply(me, arguments);
        me.mixins.mvcConsumer.init.apply(me, arguments);
    },
    getMainView: function () {
        var me = this;
        return me.mainView;
    },
    setMainView: function (viewcfg) {
        var me = this, body = Blend.getBody();
        me.mainView = me.createView(viewcfg);
        Blend.Element.clear(body);
        body.appendChild(me.mainView.getElement());
    },
    createView: function (viewConfig) {
        var me = this, cfg = {
            mvcContextId: me.getContextId()
        };
        if (Blend.isInstanceOf(viewConfig, Blend.ui.View)) {
            return viewConfig;
        } else if (Blend.isString(viewConfig)) {
            return Blend.create(viewConfig, cfg);
        } else if (Blend.isObject(viewConfig)) {
            return Blend.create(Blend.apply(cfg, viewConfig));
        } else {
            throw new Error('Unable to create a view based on: ' + viewConfig);
        }
    },
    run: function () {
        var me = this;
        me.setMainView(me.mainView || 'Blend.ui.View');
    },
    start: function () {
        var me = this;
        if (me.run() !== false) {
            me.notifyReady();
        }
    },
    notifyReady: function () {
        var me = this;
        me.fireEvent('ready');
    }
});