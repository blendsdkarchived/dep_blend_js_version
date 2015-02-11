var ms = require("mustache");

/**
 * Utility class provising various functionality to rendering mustache templates
 */
Blend.defineClass('Template', {
    singleton: true,
    /**
     * Common render function encapsulating the mustache render
     */
    render: function () {
        return ms.render.apply(ms, arguments);
    },
    renderMetaTags: function (items) {
        var me = this,
                template = '        <meta {{{attrs}}}/>',
                result = [];
        Blend.foreach(items, function (item) {
            result.push(ms.render(template, {
                attrs: me.renderAttrs(item)
            }));
        });
        return result.join("\n");
    },
    renderIndex: function (indexTemplateFile, headers) {
        var content;
        try {
            content = FileUtils.readFile(indexTemplateFile).toString();
            return ms.render(content, headers);
        } catch (e) {
            Logger.error(e);
            return null;
        }
    },
    renderAttrs: function (obj, rewrite) {
        var kv = [];
        rewrite = rewrite || function (k) {
            return k;
        };
        Blend.foreach(obj, function (v, k) {
            k = rewrite(k);
            kv.push(k + '="' + v + '"');
        });
        return kv.join(' ').trim();
    },
    renderScripts: function (items) {
        var me = this,
                template = '        <script type="text/javascript" src="{{{src}}}"></script>',
                result = [];
        Blend.foreach(items, function (item) {
            result.push(ms.render(template, item));
        });
        return result.join("\n");
    },
    renderCompactCSS: function (files) {
        var me = this, content = [],
                template = '        <style>{{{src}}}</style>';
        Blend.foreach(files, function (file) {
            content.push(FileUtils.readFile(file).toString());
        });
        return ms.render(template, {src: content.join("\n")});
    },
    renderScriptSource: function (source) {
        var me = this,
                template = '        <script type="text/javascript">{{{src}}}</script>';
        return ms.render(template, {
            src: source
        });
    },
});