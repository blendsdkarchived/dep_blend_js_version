BlendTest.defineTest('project-cfg', 'project config', function (t) {
    var p, r;
    var mkbase = function (config) {
        return Blend.create('Builder.commands.build.Base', {
            projectConfig: config
        });
    };
    p = mkbase({
        mainClass: 'a',
        name: 'a',
        indexTemplate: 'a',
        theme: 'a',
        type: 'webapp'
    });
    r = p.validateConfig();
    t.isTrue(r.isvalid, r.error || 'config ok');
    t.done();

});


