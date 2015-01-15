BlendTest.defineTest('mvc', 'mvc sanity', function (t) {

    var app_did_file_event = false;

    Blend.defineClass('Test.mvc.Controller', {
        extend: 'Blend.mvc.Controller',
        application: {
            ready: function () {
                app_did_file_event = true;
            }
        }
    });

    Blend.defineClass('Test.test.Application', {
        extend: 'Blend.mvc.Application',
        controllers: 'Test.mvc.Controller',
        prepareBodyElement: function () {

        }
    });
    var app = Blend.create('Test.test.Application');
    app.start();
    t.delay(function () {
        t.ok(app.getContextId(), 'has context id');
        t.equal(Blend.mvc.Context.getContext(app.mvcContextId).mvcContextId, app.getContextId(), 'app has been registered in Blend');
        t.equal(app_did_file_event, true, 'application did file ready event');
        t.done();
    });
});