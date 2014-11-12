/**
 * Singleton class provides basic console logging.
 * @param {type} param1
 * @param {type} param2
 */
Blend.defineClass('Logger', {
    singleton: true,
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
    /**
     * Logs a error message
     */
    error: function () {
        var me = this;
        console.error(me.createMessage('ERROR', arguments).white.bgRed);
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
