BlendTest.defineTest('fit-layout', 'window full fit', function (t) {

    var cname = t.newName();
    var aname = t.newName();

    Blend.defineClass(cname, {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                t.delay(function () {
                    var rsize = Blend.Element.getSize(me.getRect1().getElement());
                    var psize = Blend.Element.getSize(app.getMainView().getElement());
                    t.almost(psize.width, rsize.width, 'width test', 3);
                    t.almost(psize.height, rsize.height, 'height test', 3);
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
            layout: 'fit',
            items: [
                {
                    type: 'ui.rect',
                    reference: 'rect1'
                }
            ]
        }
    });

    Blend.Environment.runApplication(aname);
});


BlendTest.defineTest('fit-layout', 'window padding fit', function (t) {

    var cname = t.newName();
    var aname = t.newName();

    Blend.defineClass(cname, {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                t.delay(function () {
                    var r = Blend.Element.getSize(me.getRect1().getElement());
                    var p = Blend.Element.getInnerSize(app.getMainView().getElement());
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
            layout: 'fit',
            ui: 'graybg',
            bodyPadding: 10,
            items: [
                {
                    type: 'ui.rect',
                    reference: 'rect1'
                }
            ]
        }
    });

    Blend.Environment.runApplication(aname);
});

BlendTest.defineTest('fit-layout', 'window padding border fit', function (t) {

    var cname = t.newName();
    var aname = t.newName();

    Blend.defineClass(cname, {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                t.delay(function () {
                    var r = Blend.Element.getSize(me.getRect1().getElement());
                    var p = Blend.Element.getInnerSize(app.getMainView().getElement());
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
            layout: 'fit',
            ui: 'with_border',
            bodyPadding: 10,
            items: [
                {
                    type: 'ui.rect',
                    reference: 'rect1'
                }
            ]
        }
    });

    Blend.Environment.runApplication(aname);
});

