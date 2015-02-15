BlendTest.defineTest('fit-layout', 'fit component', function (t) {

    var cname = t.newName();
    var aname = t.newName();

    Blend.defineClass(cname, {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                t.delay(function () {
                    var r = Blend.Element.getSize(me.getRect1().getElement());
                    var p = Blend.Element.getInnerSize(me.getRect0().getElement());
                    t.equal(p.width, r.width, 'width is ok');
                    t.equal(p.height, r.height, 'height is ok');
                    t.done();
                });
            }
        }
    });

    Blend.defineClass(aname, {
        extend: 'Blend.mvc.Application',
        controllers: [cname],
        mainView: {
            type: 'ui.container',
            items: [
                {
                    reference: 'rect0',
                    type: 'ui.container',
                    layout: 'fit',
                    width: 400,
                    height: 400,
                    items: [
                        {
                            type: 'ui.rect',
                            reference: 'rect1'
                        }
                    ]
                }
            ]
        }
    });

    Blend.Environment.runApplication(aname);
});

BlendTest.defineTest('fit-layout', 'fit component padding', function (t) {

    var cname = t.newName();
    var aname = t.newName();

    Blend.defineClass(cname, {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                t.delay(function () {
                    var r = Blend.Element.getSize(me.getRect1().getElement());
                    var p = Blend.Element.getInnerSize(me.getRect0().getElement());
                    t.equal(p.width, r.width, 'width is ok');
                    t.equal(p.height, r.height, 'height is ok');
                    t.done();
                });
            }
        }
    });

    Blend.defineClass(aname, {
        extend: 'Blend.mvc.Application',
        controllers: [cname],
        mainView: {
            type: 'ui.container',
            items: [
                {
                    reference: 'rect0',
                    type: 'ui.container',
                    layout: 'fit',
                    width: 400,
                    height: 400,
                    ui: 'graybg',
                    bodyPadding: 10,
                    items: [
                        {
                            type: 'ui.rect',
                            reference: 'rect1'
                        }
                    ]
                }
            ]
        }
    });

    Blend.Environment.runApplication(aname);
});

BlendTest.defineTest('fit-layout', 'fit component border and padding', function (t) {

    var cname = t.newName();
    var aname = t.newName();

    Blend.defineClass(cname, {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                t.delay(function () {
                    var r = Blend.Element.getSize(me.getRect1().getElement());
                    var p = Blend.Element.getInnerSize(me.getRect0().getElement());
                    t.equal(p.width, r.width, 'width is ok');
                    t.equal(p.height, r.height, 'height is ok');
                    t.done();
                });
            }
        }
    });

    Blend.defineClass(aname, {
        extend: 'Blend.mvc.Application',
        controllers: [cname],
        mainView: {
            type: 'ui.container',
            items: [
                {
                    reference: 'rect0',
                    type: 'ui.container',
                    layout: 'fit',
                    width: 400,
                    height: 400,
                    ui: 'with_border',
                    bodyPadding: 10,
                    items: [
                        {
                            type: 'ui.rect',
                            reference: 'rect1'
                        }
                    ]
                }
            ]
        }
    });

    Blend.Environment.runApplication(aname);
});