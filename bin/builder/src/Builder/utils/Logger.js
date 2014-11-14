var ms = require("mustache");
var fs = require('fs');

Blend.defineClass('Logger', {
    singleton: true,
    errors: null,
    /**
     * @type {colors} reference to the colors package
     */
    colors: null,
    /**
     * Class ctor
     * @override
     */
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        var me = this;
        if (!me.colors) {
            me.colors = require('colors');
        }
    },
    dumpErrors: function (filename) {
        var me = this;
        if (FileUtils.ensurePath(filename)) {
            fs.writeFileSync(filename, ms.render('{{#lines}}<div style="color:red;">{{.}}</div>{{/lines}}', {
                lines: me.errors
            }));
        }
    },
    /**
     * Clears the errors array
     */
    clearErrors: function () {
        var me = this;
        me.errors = [];
    },
    /**
     * Logs a error message
     */
    error: function () {
        var me = this, message = me.createMessage('ERROR', arguments);
        me.errors = me.errors || [];
        me.errors.push(message);
        console.error(message.white.bgRed);
    },
    /**
     * Logs a warning message
     */
    warn: function () {
        var me = this;
        console.log(me.createMessage('WARN', arguments).white.bgMagenta);
    },
    /**
     * Logs an info message
     */
    info: function () {
        var me = this;
        console.log(me.createMessage('INFO', arguments));
    },
    /**
     * Creates a message to be logged to the console
     * @param {String} type INFO/ERROR/WARN
     * @param {String[]} pargs actuall message
     * @returns {String}
     */
    createMessage: function (type, pargs) {
        var me = this, args = [];
        Blend.foreach(pargs, function (itm) {
            args.push(itm);
        });
        return (type + "\t" + args.join(' ').trim());
    }
});
