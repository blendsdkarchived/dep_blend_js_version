BlendTest.defineTest('fit-layout', 'general', function (t) {

    var size = null;

    Blend.defineClass('Test.layout.view.Fit', {
        extend: 'Blend.ui.Container',
        alias: 'ui.fittest',
        layout: 'fit',
        width: 300,
        height: 300,
        items: [
            {
                type: 'ui.rect',
                reference: 'rect'
            }
        ]
    });

    Blend.defineClass('Test.fitlayout.Controller', {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                size = Blend.Element.getSize(me.getRect().getElement());
            }
        }
    });

    Blend.defineClass('Test.fitlayout.Application', {
        extend: 'Blend.mvc.Application',
        controllers: ['Test.fitlayout.Controller'],
        mainView: {
            type: 'ui.container',
            items: [
                {
                    type: 'ui.fittest'
                }
            ]
        }
    });

    Blend.Environment.runApplication('Test.fitlayout.Application')
    t.delay(function () {
        t.equal(size, {width: 300, height: 300}, 'fit layout rect');
        t.done();
    });
});