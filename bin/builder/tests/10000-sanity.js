BlendTest.defineTest('sanity', 'sanity', function (t) {
    require(__dirname + '/../src/Builder/core/Main.js');
    t.ok(Builder.core.Main, 'Blend Builder sanity');
    t.done();
});