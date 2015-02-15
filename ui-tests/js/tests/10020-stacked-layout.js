BlendTest.defineTest('stacked-layout', 'stacked-layout', function (t) {

    Blend.defineClass('Test.layout.view.Stacked', {
        extend: 'Blend.ui.Container',
        alias: 'ui.stacked',
        layout: 'stacked',
        width: 300,
        height: 300,
        items: [
            {
                type: 'ui.rect',
                reference: 'rect1'
            },
            {
                type: 'ui.rect',
                reference: 'rect2'
            }
        ]
    });

    Blend.defineClass('Test.stackedlayout.Controller', {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function () {
                var me = this,
                        mv = me.getApplication().getMainView();
                t.equal(mv.getActiveItem().itemIndex, 0, 'rect1 ok');
                mv.setActiveItem(me.getRect2());
                t.equal(mv.getActiveItem().itemIndex, 1, 'rect2 ok');
                mv.setActiveItem(99);
                t.notOk(mv.getActiveItem(), 'not exists');
                t.done();
            }
        }
    });

    Blend.defineClass('Test.stackedlayout.Application', {
        extend: 'Blend.mvc.Application',
        controllers: ['Test.stackedlayout.Controller'],
        mainView: {
            type: 'ui.stacked'
        }
    });

    Blend.Environment.runApplication('Test.stackedlayout.Application');
});