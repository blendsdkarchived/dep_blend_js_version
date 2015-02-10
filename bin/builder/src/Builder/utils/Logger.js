/**
 * Utility class for logging messages to the console. The error function in this
 * class has a special function whcih is gathering the errors to be rendered
 * into the index.html file. This was we can show the developer that something
 * is gone wrong when the build is in the --watch mode
 */
Blend.defineClass('Logger', {
    requires: [
        'Builder.utils.FileUtils',
        'Builder.utils.Template'
    ],
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
        FileUtils.writeFile(filename, Template.render('{{#lines}}<div style="color:red;">{{.}}</div>{{/lines}}', {
            lines: me.errors
        }));
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
            args.push(itm.toString());
        });
        return (type + "\t" + args.join(' ').trim());
    }
});
