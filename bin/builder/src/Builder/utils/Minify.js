var esprima = require('esprima');
var esmangle = require('esmangle');
var escodegen = require('escodegen');

Blend.defineClass('Minify', {
    singleton: true,
    js: function (scripts) {
        var ast = esprima.parse(scripts.join(';'));
        var optimized = esmangle.optimize(ast, null);
        var result = esmangle.mangle(optimized);
        return escodegen.generate(ast, {
            format: {
                renumber: true,
                hexadecimal: true,
                escapeless: true,
                compact: true,
                semicolons: false,
                parentheses: false
            }
        });
    },
    css: function (stylesheets) {
        return stylesheets.join("\n");
    }
});