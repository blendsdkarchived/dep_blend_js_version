var fs = require('fs');
var path = require('path');
/**
 * Utility class providing an abstraction for various file related operation
 */
Blend.defineClass('FileUtils', {
    singleton: true,
    /**
     * Make sure the path of a file exists. This function will look the dirname
     * of a given string and recursively will create the path
     * @param {type} pth
     * @returns {Boolean}
     */
    ensurePath: function (pth) {
        var folder = path.dirname(pth);
        try {
            mkdir('-p', folder);
            return true;
        } catch (e) {
            Logger.error(e);
            return false;
        }
    },
    /**
     * Encapsulates path.resolve function
     * @returns {unresolved}
     */
    resolve: function () {
        return path.resolve.apply(path, arguments);
    },
    /**
     * Copies a file from src to dest and runs a callback if provided
     * @param {type} src
     * @param {type} dst
     * @param {type} callback
     * @returns {Boolean}
     */
    copyFile: function (src, dst, callback) {
        var me = this;
        src = me.readFile(src);
        if (Blend.isFunction(callback)) {
            src = callback.apply(me, [src, dst]) || src;
        }
        if (me.ensurePath(dst)) {
            me.writeFile(dst, src);
            return true;
        } else {
            return false;
        }
    },
    /**
     * Writes data (string) to a file
     * @param {type} dst
     * @param {type} data
     * @returns {Boolean}
     */
    writeFile: function (dst, data) {
        var me = this;
        if (me.ensurePath(dst)) {
            fs.writeFileSync(dst, data);
            return true;
        } else {
            return false;
        }
    },
    /**
     * Read contents of a file
     * @param {type} src
     * @returns {readFile}
     */
    readFile: function (src) {
        return fs.readFileSync(src);
    }
});