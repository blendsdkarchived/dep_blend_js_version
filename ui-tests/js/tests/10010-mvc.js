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

    Blend.defineClass('Test.mvc.Application', {
        extend: 'Blend.mvc.Application',
        controllers: 'Test.mvc.Controller'
    });

    var app = Blend.create('Test.mvc.Application');
    app.run();
    t.delay(function () {
        t.ok(app.mvcContextId, 'has context id');
        t.equal(Blend.mvcContext[app.mvcContextId].mvcContextId, app.mvcContextId, 'app has been registered in Blend');
        t.equal(app_did_file_event, true, 'application did file ready event');
        t.done();
    });
});