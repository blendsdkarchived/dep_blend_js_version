BlendTest.defineTest('Blend.Element', 'dom object', function (t) {
    t.ok(Blend.get, 'blend dom get wrap');
    t.ok(Blend.get('eltest3'), 'getting element by Blend.get');
    t.done();
});

BlendTest.defineTest('Blend.Element', 'dom el init', function (t) {
    var el = Blend.get('eltest3');
    t.ok(el.$$.cls, 'element has metadata object');

    var t2 = Blend.get('eltest2');
    t.equal(t2.$$.cls.length, 3, 'loading current classes');
    t.done();
});

BlendTest.defineTest('Blend.Element', 'css tests', function (t) {
    Blend.CSS.set('eltest1', ['jack', 'jill']);
    var t1 = Blend.get('eltest1');
    t.equal(t1.$$.cls.length, 2, 'added cls');

    Blend.CSS.unset(t1, 'jack');
    t.equal(t1.$$.cls.length, 1, 'removed cls');

    var t2 = Blend.CSS.clear('eltest2');
    t.equal(t2.$$.cls.length, 0, 'removed elements');

    Blend.CSS.set(t2, ['jack', 'jill']);
    t.equal(t2.$$.cls.length, 2, 'count after adding after clear');

    t.equal(true, Blend.CSS.has(t2, 'jill'), 'single param has');

    var r = Blend.CSS.has(t2, ['sara', 'jill']);
    t.equal(false, r.sara, 'multi param has (false)');
    t.equal(true, r.jill, 'multi param has (true)');
    t.done();

});

BlendTest.defineTest('Blend.Element', 'style', function (t) {
    Blend.Style.set('eltest3', {
        width: 100,
        height: 100,
        'background-color': 'red'
    });
    var el = Blend.get('eltest3');
    t.equal('100px', el.style.getPropertyValue('width'), 'get raw property');

    var size = Blend.Style.get(el, ['width', 'height']);
    t.equal(100, size.width, 'got width');
    t.done();
});

BlendTest.defineTest('Blend.Element', 'element style', function (t) {
    var el = Blend.get('eltest1');
    Blend.Style.set(el, {'background-color': 'blue'});

    var el = Blend.Style.unset(el, 'not-exist');
    t.ok(el, 'deleteing non existant style');

    Blend.Element.hide(el);
    t.equal(false, Blend.Element.isVisible(el));
    Blend.Element.show(el);
    t.equal(true, Blend.Element.isVisible(el));
    t.delay(function () {
        t.equal(Blend.Style.get(el, 'background-color').indexOf('rgb') !== -1, true, "DYNAMIC " + Blend.Style.get(el, 'background-color'));
        t.done();
    });
});

BlendTest.defineTest('Blend.Element', 'Blend.Style.get', function (t) {
    var el = Blend.Element.create({
        style: {
            width: 100,
            height: 100,
            top: 5,
            left: 5,
            position: 'absolute'
        }
    });
    Blend.getBody().appendChild(el);
    t.delay(function () {
        var res = Blend.Style.get(el, ['width', 'height', 'top', 'left']);
        t.equal(res, {width: 100, height: 100, top: 5, left: 5}, 'get styles');
        t.done();
    });
});