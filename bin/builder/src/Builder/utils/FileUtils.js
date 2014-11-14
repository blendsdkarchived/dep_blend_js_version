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
    }
});