BlendTest.defineTest('category', 'testname', function (t) {
    t.ok(true, 'ok test');
    t.isTrue(true, 'true');
    t.isFalse(false, 'false');
    t.notOk(undefined, 'not ok');
    t.equal({a: 1}, {a: 1}, 'deep equal');
    t.throws_exception(function () {
        throw new Error('ERROR!')
    }, 'ERROR!', 'exception');
    t.done();
});