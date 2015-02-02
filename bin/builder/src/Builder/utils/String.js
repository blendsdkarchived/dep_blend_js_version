/**
 * Utility class that provides various handy functions for manipulating
 * strings. Please note that some of these function are augmented into core
 * javascript and cannot be used from this class.
 */
Blend.defineClass('Blend.utils.String', {
    singleton: true,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.startsWith();
        me.endsWith();
    },
    /**
     * Creates JAVA style hashCode from string
     * @param {string} value the string to calculate a hash for.
     * @return {number} the hash number
     */
    hashCode: function (value) {
        var hash = 0, i, cr, l;
        if (value.length === 0) {
            return hash;
        }
        for (i = 0, l = value.length; i < l; i++) {
            cr = value.charCodeAt(i);
            hash = ((hash << 5) - hash) + cr;
            hash |= 0;
        }
        return hash;
    },
    /**
     * Checks if a string ends with another string. This function is avaiable
     * from any string variable
     * @returns {boolean}
     */
    endsWith: function () {
        if (typeof String.prototype.endsWith !== 'function') {
            String.prototype.endsWith = function (str) {
                return this.slice(-str.length) === str;
            };
        }
    },
    /**
     * Checks if a string starts with another string. This function is avaiable
     * from any string variable
     * @returns {boolean}
     */
    startsWith: function () {
        if (typeof String.prototype.startsWith !== 'function') {
            String.prototype.startsWith = function (str) {
                return this.slice(0, str.length) === str;
            };
        }
    },
    /**
     * Trims the training linefeeds and spacing from start end ending of a string
     * This function is available from any string variable
     * @returns {string}
     */
    trim: function () {
        if (!String.prototype.trim) {
            String.prototype.trim = String.prototype.trim || function () {
                return this.replace(/^\s+/, '').replace(/\s+$/, '');
            };
        }
    },
    /**
     * Make the first character of a string upper-cased
     * This function is available from any string variable
     * @returns {string}
     */
    ucfirst: function () {
        if (!String.prototype.ucfirst) {
            String.prototype.ucfirst = String.prototype.ucfirst || function () {
                return this.charAt(0).toUpperCase() + this.slice(1);
            };
        }
    }
});

