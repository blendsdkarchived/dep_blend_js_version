/**
 * This class is mainly used to help the builder require test files.
 */
Blend.defineClass('UITest.core.Main', {
    requires: [
        'Blend.Environment',
        'Blend.collection.Array',
        'Blend.collection.Object',
        'Blend.mvc.Application',
        'Blend.Environment'
    ]
});

Blend.defineClass('Test.mvc.Application', {
    extend: 'Blend.mvc.Application',
    prepareBodyElement: function () {

    }
});