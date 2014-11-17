var path = require('path');
var fs = require('fs');

Blend.defineClass('Builder.cache.Cache', {
    root: null,
    cache: null,
    exts: [],
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.cache = {};
        me.exts = me.exts || [];
        me.exts = me.exts.concat(['.js', '.json', '.css']);
    },
    /**
     * Updates the current cache and returns an index of changes
     * @param {type} sync
     * @returns {object}
     */
    update: function (sync) {
        var me = this, list, updates = {}, hash, update = false;
        me.root = Blend.wrapInArray(me.root);
        Blend.foreach(me.root, function (item, key) {
            me.root[key] = path.resolve(item)
        });
        list = me.scanFolder(me.root);
        Blend.foreach(me.cache, function (citem, key) {
            hash = list[key] || null;
            if (hash) {
                citem.status = hash === citem.hash ? 'u' : 'c';
                citem.hash = hash;
                if (citem.status === 'c') {
                    update = true;
                }
            } else {
                me.cache[key].status = 'd';
                update = true;
            }
        });
        Blend.foreach(list, function (hash, key) {
            if (!me.cache[key]) {
                me.cache[key] = {
                    status: sync ? 'u' : 'n',
                    hash: hash
                };
                update = true;
            }
        });

        if (update) {
            updates = {};
            Blend.foreach(me.cache, function (item, key) {
                if (item.status !== 'u') {
                    updates[key] = item;
                }
            });
        }
        me._updates = updates;
        return updates;
    },
    /**
     * Synchronize the cache with the current state of files
     */
    sync: function () {
        var me = this, dels = [];
        // set everything to unchanged
        Blend.foreach(me.cache, function (item, key) {
            if (item.status === 'd') {
                dels.push(key)
            } else {
                item.status = 'u';
            }
        });
        // clean up the deletes
        dels.forEach(function (key) {
            delete(me.cache[key]);
        });
    },
    /**
     * Check if a file has the correct extension
     * @param {type} file
     * @returns {Boolean}
     */
    isValid: function (file) {
        var me = this, ext = path.extname(file);
        return ext !== '' && me.exts.indexOf(ext) !== -1;
    },
    /**
     * Recursively scan folders and create an index with stat data as hash
     * @param {type} root
     * @returns {String}
     */
    scanFolder: function (root) {
        var me = this, result = {}, list, file, stat, lstat;
        if (Blend.isArray(root)) {
            root.forEach(function (folder) {
                result = Blend.apply(result, me.scanFolder(folder));
            });
            return result;
        } else {
            list = fs.readdirSync(root);
            list.forEach(function (item) {
                if (item.charAt(0) !== '.') {
                    file = path.resolve(root + path.sep + item);
                    lstat = fs.lstatSync(file);
                    if (lstat.isFile() && me.isValid(item) && file.indexOf('/build/') === -1) {
                        stat = fs.statSync(file);
                        result[file] = stat.size + '.' + stat.mtime.getTime();
                    } else if (lstat.isDirectory()) {
                        result = Blend.apply(result, me.scanFolder(file));
                    }
                }
            });
            return result;
        }
    },
    /**
     * Gets the list of updated files by extension
     * @param {type} ext
     * @returns {object}
     */
    getFilesByExtension: function (ext, list) {
        var me = this, res = {},
                list = list || (me._updates || {});
        Blend.foreach(list, function (itm, fname) {
            if (path.extname(fname) === ext) {
                res[fname] = itm;
            }
        });
        return res;
    },
    /**
     * Gets the list of updated .js files
     * @returns {object}
     */
    getJSFiles: function () {
        var me = this;
        return me.getFilesByExtension('.js');
    },
    /**
     * Get the list of all CSS files regardless of their updated status
     * This function is primarily used to bind CSS files to their class
     * counterparts
     * @returns {unresolved}
     */
    getCSSFiles: function () {
        var me = this;
        return me.getFilesByExtension('.css', me.cache);
    }
});

