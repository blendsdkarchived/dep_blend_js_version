BlendTest.defineTest('fit-layout', 'general', function (t) {

    var appSize = null;

    Blend.defineClass('Test.fitlayout.Controller', {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                appSize = Blend.Element.getSize(app.getMainView().getElement());
            }
        }
    });

    Blend.defineClass('Test.fitlayout.Application', {
        extend: 'Blend.mvc.Application',
        controllers: 'Test.fitlayout.Controller',
        mainView: {
            type: 'ui.rect'
        }
    });
    Blend.Environment.runApplication('Test.fitlayout.Application')
    t.delay(function () {
        var winSize = Blend.Element.getSize(window);
        t.equal(appSize, winSize, 'same app size');
        t.done();
    });
});