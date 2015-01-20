BlendTest.defineTest('center-layout', 'general', function (t) {

    var bounds = null;

    Blend.defineClass('Test.layout.view.Center', {
        extend: 'Blend.ui.Container',
        alias: 'ui.fittest',
        layout: 'center',
        width: 300,
        height: 300,
        items: [
            {
                type: 'ui.rect',
                reference: 'rect',
                width: 75,
                height: 75
            }
        ]
    });

    Blend.defineClass('Test.centerlayout.Controller', {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                bounds = Blend.Element.getBounds(me.getRect().getElement());
            }
        }
    });

    Blend.defineClass('Test.centerlayout.Application', {
        extend: 'Blend.mvc.Application',
        controllers: ['Test.centerlayout.Controller'],
        mainView: {
            type: 'ui.container',
            items: [
                {
                    type: 'ui.fittest'
                }
            ]
        }
    });

    Blend.Environment.runApplication('Test.centerlayout.Application');
    t.delay(function () {
        t.almost(bounds.top, 112, 'center layout rect');
        t.almost(bounds.left, 112, 'center layout rect');
        t.done();
    });
});