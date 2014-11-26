BlendTest.defineTest('env', 'Ready', function (t) {
    var ready = false;
    Blend.Environment.ready(function () {
        ready = true;
    });
    Blend.Environment.kickStart();
    t.delay(function () {
        t.isTrue(ready, 'ready fired!');
        t.done();
    });
});
