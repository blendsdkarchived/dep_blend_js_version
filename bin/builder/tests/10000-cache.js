BlendTest.defineTest('cache', 'cache', function (t) {
    var cache = Blend.create('Builder.cache.Cache', {
        root: __dirname + '/../',
        exts: ['.scss', '.ms']
    });

    var exec = require('child_process').exec;
    console.log(cache.update());
    exec('echo hello > ' + __dirname + "/test1.ms");
    exec('echo hello > ' + __dirname + "/test2.ms");
    console.log(cache.update());
    exec('rm ' + __dirname + "/test1.ms");
    console.log(cache.update());
    exec('rm ' + __dirname + "/test2.ms");
    exec('rm ' + __dirname + "/test2.ms");
    cache.sync();
    console.log(cache.update());
});