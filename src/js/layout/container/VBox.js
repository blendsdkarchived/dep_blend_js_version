Blend.defineClass('Blend.layout.container.VBox', {
    extend: 'Blend.layout.container.Box',
    alias: 'layout.vbox',
    cssPrefix: 'vbox',
    direction: 'v',
    handler: function () {
        return Blend.LayoutUtil.vflex.apply(Blend.LayoutUtil, arguments);
    }
});