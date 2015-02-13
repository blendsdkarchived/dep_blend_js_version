BlendTest.defineTest('fit-layout', 'fit component', function (t) {

    var cname = t.newName();
    var aname = t.newName();

    Blend.defineClass(cname, {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                t.delay(function () {
                    var r0 = Blend.Element.getSize(me.getRect0().getElement());
                    var r1 = Blend.Element.getSize(me.getRect1().getElement());
                    var diff = 0;
                    if (Blend.Environment.isIE) {
                        diff = 2;
                    }
                    t.equal(r0.width, r1.width + diff, 'width test');
                    t.equal(r0.height, r1.height + diff, 'height test');
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
                    var r0 = Blend.Element.getSizeAndPosition(me.getRect0().getElement());
                    var r1 = Blend.Element.getSizeAndPosition(me.getRect1().getElement());
                    var diff = 20;
                    if (Blend.Environment.isIE) {
                        diff = 2;
                    }
                    t.equal(r0.width - diff, r1.width, 'component width ok');
                    t.equal(r0.height - diff, r1.height, 'component height ok');
                    t.equal(r1.top, 0, 'component top ok');
                    t.equal(r1.left, 0, 'component left ok');
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
                    ui: 'with_padding',
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
                    var r0 = Blend.Element.getSizeAndPosition(me.getRect0().getElement());
                    var r1 = Blend.Element.getSizeAndPosition(me.getRect1().getElement());
                    var diff = 30;
                    if (Blend.Environment.isIE) {
                        diff = 2;
                    }
                    t.equal(r0.width - diff, r1.width, 'component width ok');
                    t.equal(r0.height - diff, r1.height, 'component height ok');
                    t.equal(r1.top, 0, 'component top ok');
                    t.equal(r1.left, 0, 'component left ok');
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