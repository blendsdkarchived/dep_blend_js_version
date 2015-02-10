/**
 * Required libraries. We use these directly here for performance reasons instead
 * of utils FileUtils
 */
var fs = require('fs');
var path = require('path');

/**
 * Folder watcher utility that is used for the build and watch process
 */
Blend.defineClass('Builder.utils.FolderWatcher', {
    state: null,
    root: null,
    extensions: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.extensions = me.extensions || [];
        me.state = {
            hash: null,
            updated: false
        };
    },
    getFilesByType: function (type) {
        var me = this;
        me.state[type] = me.state[type] || [];
        return me.state[type];
    },
    processFiles: function (list) {
        var me = this, ext;
        Blend.foreach(list, function (stat, file) {
            ext = path.extname(file).replace('.', '');
            me.state[ext] = me.state[ext] || [];
            me.state[ext].push(file);
        });
    },
    isChanged: function () {
        var me = this;
        return me.state.updated;
    },
    update: function () {
        var me = this;
        var list = me.scanFolder(me.root), hashlist = [];
        Blend.foreach(list, function (stat, file) {
            hashlist.push(stat);
        });
        var md5 = hashlist.join('').md5();
        if (md5 !== me.state.hash) {
            me.state = {
                hash: md5,
                updated: true
            };
            me.processFiles(list);
        } else {
            me.state.updated = false;
        }
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
     * Check if a file has the correct extension
     * @param {type} file
     * @returns {Boolean}
     */
    isValid: function (file) {
        var me = this, ext = path.extname(file);
        return ext !== '' && me.extensions.indexOf(ext) !== -1;
    },
});

