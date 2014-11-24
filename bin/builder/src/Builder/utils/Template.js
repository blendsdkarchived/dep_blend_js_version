var ms = require("mustache");
var fs = require('fs');

ms.escape = function (a) {
    return a;
}

Blend.defineClass('Template', {
    singleton: true,
    renderIndex: function (indexTemplateFile, headers) {
        var me = this, content;
        try {
            content = fs.readFileSync(indexTemplateFile).toString();
            return ms.render(content, headers);
        } catch (e) {
            Logger.error(e);
            return null;
        }
    },
    renderDevHeaders: function (meta, styles, scripts) {
        var me = this,
                template = '{{meta}}\n{{styles}}\n{{scripts}}';
        return ms.render(template, {
            meta: meta,
            styles: styles,
            scripts: scripts
        });
    },
    renderScripts: function (items) {
        var me = this,
                template = '        <script type="text/javascript" src="{{src}}"></script>',
                result = [];
        Blend.foreach(items, function (item) {
            result.push(ms.render(template, item));
        });
        return result.join("\n");
    },
    renderStyleSheets: function (items) {
        var me = this,
                template = '        <link type="text/css" rel="stylesheet" {{attrs}}/>',
                result = [];
        Blend.foreach(items, function (item) {
            result.push(ms.render(template, {
                attrs: me.renderAttrs(item, function (k) {
                    if (k === 'src') {
                        return 'href';
                    } else {
                        return k;
                    }
                })
            }));
        });
        return result.join("\n");
    },
    renderMetaTags: function (items) {
        var me = this,
                template = '        <meta {{attrs}}/>',
                result = [];
        Blend.foreach(items, function (item) {
            result.push(ms.render(template, {
                attrs: me.renderAttrs(item)
            }));
        });
        return result.join("\n");
    },
    renderAttrs: function (obj, rewrite) {
        var me = this, kv = []
        rewrite = rewrite || function (k) {
            return k;
        };
        Blend.foreach(obj, function (v, k) {
            k = rewrite(k);
            kv.push(k + '="' + v + '"');
        });
        return kv.join(' ').trim();
    }
});