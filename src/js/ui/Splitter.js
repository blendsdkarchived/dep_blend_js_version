Blend.defineClass('Blend.ui.Splitter', {
    extend: 'Blend.ui.Component',
    requires: [
        'Blend.Environment'
    ],
    alias: 'ui.splitter',
    size: 6,
    splitterType: null,
    ghostEl: null,
    element: {
        unselectable: true,
        listeners: {
            mousedown: function () {
                var me = this, handler = me[me.splitterType];
                if (handler) {
                    handler.apply(me, arguments);
                }
            }
        }
    },
    init: function () {
        var me = this, lt;
        me.callParent.apply(me, arguments);
        if (me.parent && me.parent.layout) {
            lt = me.parent.layout.alias.replace('layout.', '');
            if (lt === 'hbox') {
                me.splitterType = 'vertical';
            } else if (lt === 'vbox') {
                me.splitterType = 'horizontal';
            } else {
                throw new Error('Splitter can only be placed in a container component with a HBox or a VBox layout');
            }
        }
        me.element.cls = Blend.cssPrefix(['splitter', 'splitter-' + me.splitterType]);
        me.width = me.height = me.size;
    }
});