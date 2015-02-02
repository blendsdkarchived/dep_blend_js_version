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
    }
});