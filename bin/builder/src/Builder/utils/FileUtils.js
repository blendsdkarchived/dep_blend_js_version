var fs = require('fs');
var path = require('path');

Blend.defineClass('FileUtils', {
    singleton: true,
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
    copyFile: function (src, dst, callback) {
        var me = this;
        src = fs.readFileSync(src);
        if (Blend.isFunction(callback)) {
            src = callback.apply(me, [src, dst]) || src;
        }
        me.ensurePath(dst);
        fs.writeFileSync(dst, src);
    }
});