Blend.defineClass('Blend.layout.container.HBox', {
    extend: 'Blend.layout.container.Box',
    alias: 'layout.hbox',
    cssPrefix: 'hbox',
    handler: function () {
        var util = Blend.layout.utils.Box;
        return util.hflex.apply(util, arguments);
    }

});