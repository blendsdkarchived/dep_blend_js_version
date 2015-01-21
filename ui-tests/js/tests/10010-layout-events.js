BlendTest.defineTest('layout-events', 'layout-events', function (t) {

    var count = 0;

    Blend.defineClass('Test.layout.event.Controller', {
        extend: 'Blend.mvc.Controller',
        rect: {
            sizeChanged: function (sender, width, height) {
                sender.setText(++sender.lx);
                count++;
            }
        },
        application: {
            ready: function () {
                var me = this;
                setTimeout(function () {
                    var r = me.getRect();
                    r[0].layoutContext.flex = 0.25;
                    r[0].flex = 0.25;
                    r[0].setWidth(0);
                }, 10);
            }
        }
    });

    Blend.defineClass('Test.layout.event.Application', {
        extend: 'Blend.mvc.Application',
        controllers: ['Test.layout.event.Controller'],
        mainView: {
            type: 'ui.container',
            items: [
                {
                    type: 'ui.container',
                    layout: 'hbox',
                    ui: 'graybg',
                    width: 400,
                    height: 200,
                    items: [
                        {
                            type: 'ui.rect',
                            reference: 'rect',
                            lx: 0,
                            flex: 1
                        },
                        {
                            type: 'ui.rect',
                            reference: 'rect',
                            lx: 0,
                            flex: 1
                        }

                    ]
                }
            ]
        }
    });

    Blend.Environment.runApplication('Test.layout.event.Application');

    t.delay(function () {
        t.equal(count, 4, 'layout counts');
        t.done();
    });
});