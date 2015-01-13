Blend.defineClass('Blend.mvc.Application', {
    requires: [
        'Blend.mvc.Controller',
        'Blend.Environment',
        'Blend.layout.Util',
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
    /**
     * Set the main view for this application.
     * @param {object/string} viewcfg
     */
    setMainView: function (viewcfg) {
        var me = this, body = Blend.getBody();
        me.mainView = me.createView(viewcfg);
        Blend.Element.clear(body);
        body.appendChild(me.mainView.getElement());
        me.layoutMainView();
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
    /**
     * @private
     * Layout the mainView by fitting it into the BODY element. The BODY element
     * already takes the whole page, this means that our mainView will be in full
     * page when the layout is complete.
     * @returns {undefined}
     */
    layoutMainView: function () {
        var me = this;
        Blend.LayoutUtil.fit(Blend.dom.Dom.getWindow(), me.mainView.getElement());
    },
    /**
     * @private
     * Hanlder for when the window is being resized.
     */
    onWindowResize: function () {
        var me = this;
        if (!me._resizing) {
            me._resizing = true;
            me.layoutMainView();
            me._resizing = false;
        }
    },
    /**
     * @private
     * Setup a window listener so we can resize the main view and check for the
     * responsive events.
     */
    setupWindowListeners: function () {
        var me = this;
        Blend.Environment.addEventListener(window, 'resize', function () {
            setTimeout(function () {
                me.onWindowResize.apply(me, arguments);
                me.notifyResize.apply(me, arguments);
            }, 100);
        });
    },
    run: function () {
        var me = this;
        me.setMainView(me.mainView || 'Blend.ui.View');
    },
    start: function () {
        var me = this;
        if (me.run() !== false) {
            me.setupWindowListeners();
            me.notifyReady();
        }
    },
    notifyReady: function () {
        var me = this;
        me.fireEvent('ready');
    },
    notifyResize: function () {
        var me = this;
        me.fireEvent('resize', arguments);
    }
});