BlendTest.defineTest('center-layout', 'general', function (t) {

    var appSize = null;

    Blend.defineClass('Test.centerlayout.Controller', {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function (app) {
                var me = this;
                appSize = Blend.Element.getSize(app.getMainView().getElement());
            }
        }
    });

    Blend.defineClass('Test.centerlayout.Application', {
        extend: 'Blend.mvc.Application',
        controllers: 'Test.centerlayout.Controller',
        mainView: {
            type: 'ui.container'
        }
    });
    Blend.Environment.runApplication('Test.centerlayout.Application')
    t.delay(function () {
        var winSize = Blend.Element.getSize(window);
        t.equal(appSize, winSize, 'same app size');
        t.done();
    });
});