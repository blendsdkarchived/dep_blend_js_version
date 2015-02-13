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
                    t.equal(psize, rsize, 'full fit');
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
                    var p = Blend.Element.getSize(app.getMainView().getElement());
                    t.isTrue(r.width === (p.width - 20), 'width is ok');
                    t.isTrue(r.height === (p.height - 20), 'width is ok');
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
            ui: 'with_padding',
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
                    var p = Blend.Element.getSize(app.getMainView().getElement());
                    t.isTrue(r.width === (p.width - 30), 'width is ok');
                    t.isTrue(r.height === (p.height - 30), 'height is ok');
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