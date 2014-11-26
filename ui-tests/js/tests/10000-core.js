//
BlendTest.defineTest('core', 'Blend sanity test', function (t) {
    t.ok(Blend, 'blend object');
    var str = " a ";
    t.equal(str.trim(), 'a', 'string trimmed');
    t.done();
});

BlendTest.defineTest('core', 'Blend.isString', function (t) {
    t.equal(Blend.isString('abc'), true, 'isString with string');
    t.equal(Blend.isString("0"), true, 'isString with "0"');
    t.equal(Blend.isString(""), true, 'isString with ""');
    t.equal(Blend.isString(123), false, 'isString with number');
    t.equal(Blend.isString({}), false, 'isString with object');
    t.equal(Blend.isString(function () {
    }), false, 'isString with function');
    t.equal(Blend.isString(undefined), false, 'isString with undefined');
    t.equal(Blend.isString(null), false, 'isString with null');
    t.equal(Blend.isString(true), false, 'isString with true');
    t.equal(Blend.isString(false), false, 'isString with false');
    t.done();
});

BlendTest.defineTest('core', 'Blend.isObject', function (t) {
    t.equal(Blend.isObject({}), true, 'with empty object');
    t.equal(Blend.isObject(function () {
    }), false, 'with function');
    t.equal(Blend.isObject(function () {
        this.a = 1;
    }), false, 'with function constructor');
    t.equal(Blend.isObject(1), false, 'with function number');
    t.equal(Blend.isObject(null), false, 'with null');
    t.equal(Blend.isObject(undefined), false, 'with undefined');
    t.equal(Blend.isObject(), false, 'with no args');
    t.done();
});


BlendTest.defineTest('core', 'Blend.apply', function (t) {
    var a = {a: 'a'};
    var b = {b: 'b'};
    var c = {c: 'c'};
    t.equal(undefined, Blend.apply(), 'no object');
    t.equal({a: 'a'}, Blend.apply(a), 'one object');
    t.equal({a: 'a', b: 'b'}, Blend.apply(a, b), 'two objects');
    t.equal({a: 'a', b: 1}, Blend.apply(a, {b: 1}, true), 'two object static');
    t.equal({a: null, b: b}, Blend.apply({a: null}, {b: b}), 'two object with null and complex b');
    t.done();
});

BlendTest.defineTest('core', 'Blend.namespace', function (t) {
    var ns1 = 'Blend.grid.plugins';
    var ns2 = 'Test.grid.plugins';
    Blend.namespace(ns1);
    t.ok(Blend.grid.plugins, ns1);
    Blend.namespace(ns2);
    t.ok(Test.grid.plugins, ns2);
    t.done();
});


BlendTest.defineTest('core', 'Blend.isFunction', function (t) {
    t.equal(Blend.isFunction(function () {
    }), true, 'with empty function');
    t.equal(Blend.isFunction(1), false, 'with number');
    t.equal(Blend.isFunction(null), false, 'with null');
    t.equal(Blend.isFunction(undefined), false, 'with undefined');
    t.equal(Blend.isFunction(), false, 'with no args');
    t.done();
});


BlendTest.defineTest('core', 'Blend.isArray', function (t) {
    t.equal(Blend.isArray('abc'), false, 'isArray with string');
    t.equal(Blend.isArray(123), false, 'isArray with number');
    t.equal(Blend.isArray({}), false, 'isArray with object');
    t.equal(Blend.isArray(function () {
    }), false, 'isArray with function');
    t.equal(Blend.isArray(undefined), false, 'isArray with undefined');
    t.equal(Blend.isArray(null), false, 'isArray with null');
    t.equal(Blend.isArray(true), false, 'isArray with true');
    t.equal(Blend.isArray(false), false, 'isArray with false');

    t.equal(Blend.isArray(['abc', 'abc']), true, 'isArray with string');
    t.equal(Blend.isArray([123, 123]), true, 'isArray with number');
    t.equal(Blend.isArray([{}, {}]), true, 'isArray with object');
    t.equal(Blend.isArray([function () {
        }, null]), true, 'isArray with function');
    t.equal(Blend.isArray([undefined, null]), true, 'isArray with undefined');
    t.equal(Blend.isArray([null, undefined]), true, 'isArray with null');
    t.equal(Blend.isArray([true, false]), true, 'isArray with true');
    t.equal(Blend.isArray([true, function () {
        }]), true, 'isArray with true');
    t.done();
});


BlendTest.defineTest('core', 'Blend.foreach', function (t) {
    var exp = 1, a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], o = {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1,
        f: 1,
        g: 1,
        h: 1,
        i: 1,
        j: 1
    };

    Blend.foreach(a, function (v, i) {
        exp += v;
    });
    t.equal(exp, 56, 'foreach array');

    exp = 0;
    Blend.foreach(o, function (v) {
        exp += v;
    });
    t.equal(exp, 10, 'foreach obj');
    t.done();
});


BlendTest.defineTest('core', 'Blend.isInstanceOf', function (t) {
    Blend.defineClass('Test.InstClass');
    var obj = Blend.create('Test.InstClass');
    t.equal(Blend.isInstanceOf(obj, 'Test.InstClass'), true, ' is inst of 1');
    t.equal(Blend.isInstanceOf(obj, Test.InstClass), true, ' is inst of 2');
    t.equal(Blend.isInstanceOf(obj, 'Test.InstClass2'), false, ' is not inst of ');
    t.done();
});

BlendTest.defineTest('core', 'Blend.isInstanceOf with Mixins', function (t) {
    Blend.defineClass('Test.ClassMx1');
    Blend.defineClass('Test.ClassMx2');
    Blend.defineClass('Test.ClassC1', {
        mixins: {
            mx1: 'Test.ClassMx1',
            mx2: 'Test.ClassMx2'
        }
    });
    Blend.defineClass('Test.ClassC2', {
        mixins: {
            mx2: 'Test.ClassMx2'
        }
    });

    var oc1 = Blend.create('Test.ClassC1');
    var oc2 = Blend.create('Test.ClassC2');

    t.equal(Blend.isInstanceOf(oc1, 'Test.ClassMx1'), true, 'instance of mx1');
    t.equal(Blend.isInstanceOf(oc1, 'Test.ClassMx2'), true, 'instance of mx2');
    t.equal(Blend.isInstanceOf(oc2, 'Test.ClassMx1'), false, 'not instance of mx1');
    t.equal(Blend.isInstanceOf(oc2, 'Test.ClassMx2'), true, 'instance of mx2');
    t.done();
});

BlendTest.defineTest('core', 'Blend.clone', function (t) {
    var obj1 = {o1: 100};
    var obj2 = {o2: 200};
    var obj3 = {
        a: obj1,
        b: obj2
    };
    var obj4 = Blend.clone(obj3);
    obj4.b.o2++;
    t.equal(obj2.o2, 200, 'old object');
    t.equal(obj4.b.o2, 201, 'cloned object');
    t.done();
});

BlendTest.defineTest('css-prefix', 'Css Prefix Test', function (t) {
    var r = Blend.cssPrefix(['test', 'hello', 'world']);
    t.equal(r, ['b-test', 'b-hello', 'b-world'], '3 prefixed');
    t.done();
});
