BlendTest.defineTest('commandline', 'options', function (t) {
    var cmd = null;
    cmd = Blend.create('Builder.utils.CommandLine');
    t.isFalse(cmd.initParseOptions(''), 'no command line');

    cmd = Blend.create('Builder.utils.CommandLine');
    t.isTrue(cmd.initParseOptions('build'), 'parsed');
    t.equal(cmd.options.command, 'build', 'got build command');

    cmd = Blend.create('Builder.utils.CommandLine');
    cmd.initParseOptions('build --watch');
    t.isTrue(cmd.options.watch, 'watch');

    cmd = Blend.create('Builder.utils.CommandLine');
    cmd.initParseOptions('build --path=/test/abc');
    t.equal(cmd.options.path, '/test/abc', 'correct path returned');
    t.equal(cmd.validateBuildPath().result, false, 'invalid build path');

    t.done();
});

BlendTest.defineTest('commandline', 'build path', function (t) {
    var cmd = null;

    cmd = Blend.create('Builder.utils.CommandLine');
    cmd.initParseOptions('build --path=/test/abc');
    t.equal(cmd.validateBuildPath().result, false, 'invalid build path');

    cmd = Blend.create('Builder.utils.CommandLine');
    cmd.initParseOptions('build --path=/tmp/app1.json');
    t.equal(cmd.validateBuildPath().result, false, 'invalid path file');

    t.done();
})


