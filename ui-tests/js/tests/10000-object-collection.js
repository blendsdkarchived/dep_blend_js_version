BlendTest.defineTest('ObjectCollection', 'object collection', function(t) {
    var col = new Blend.collection.Object();
    col.add('a', 1);
    col.add('b', 5);
    t.equal(2, col.count(), 'count of two added');
    t.equal(1, col.get('a'), 'retrive by index 1');
    t.equal(5, col.get('b'), 'retrive by index 2');
    t.done();
});

BlendTest.defineTest('ObjectCollection', 'object collection remove', function(t) {
    var col = new Blend.collection.Object();
    col.add('a', 1);
    col.add('b', 5);
    col.add('c', 5);
    var deleted = col.remove('b');
    t.equal(5, deleted, 'the delected value');
    t.equal(2, col.count(), 'number of items after deletion');

    var keys = col.getKeys();
    t.equal(['a', 'c'], keys, 'keys in the collection');

    col.clear();
    t.equal(0, col.count(), 'number of items after clear');
    t.done();
});

BlendTest.defineTest('ObjectCollection', 'object collection removeAt', function(t) {
    var col = new Blend.collection.Object();
    col.add('a', 1);
    col.add('b', 5);
    col.add('c', 6);
    col.removeAt(0);
    col.removeAt(1);
    t.equal(col.getAt(0), 5, 'Removing by index');
    t.done();

});

BlendTest.defineTest('ObjectCollection', 'object collection has key', function(t) {
    var col = new Blend.collection.Object();
    col.add('a', 1);
    col.add('b', 5);
    col.add('c', 6);
    t.equal(true, col.hasKey('a'), 'has key 1');

    col.remove('b');
    t.equal(false, col.hasKey('b'), 'has key 1');
    t.done();
});


BlendTest.defineTest('ObjectCollection', 'object collection each', function(t) {
    var col = new Blend.collection.Object();
    var sum = 0;
    col.add('a', 2);
    col.add('b', 2);
    col.add('c', 2);
    col.each(function(value) {
        sum += value;
    });
    t.equal(6, sum, 'collection each');
    t.done();
});

BlendTest.defineTest('ObjectCollection', 'object collection find', function(t) {
    var col = new Blend.collection.Object();
    var sum = 0;
    col.add('a', {v: 0, id: Blend.id()});
    col.add('b', {v: 1, id: Blend.id()});
    col.add('c', {v: 0, id: Blend.id()});
    col.add('d', {v: 1, id: Blend.id()});
    var r = col.find(function(item) {
        return item.v === 0;
    });
    t.equal(2, r.count(), 'collection find');
    t.equal(2, r.toArray().length, 'collection find as array');
    t.done();
});