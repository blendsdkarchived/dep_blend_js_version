var ms = require("mustache");
var path = require("path");
var fs = require("fs");
require("shelljs/global");
Blend.defineClass('Builder.commands.build.Command', {
    extend: 'Builder.commands.build.Base',
    runInternal: function () {
        var me = this;
        if (me.options.watch === true) {
            me.runWithWatcher();
        } else {
            me.runBuilder();
        }
    },
    runWithWatcher: function () {
        var me = this,
                working = false,
                builder = me.createBuilder();
        _run = function () {
            if (working === false) {
                working = true;
                builder.run();
                working = false;
            }
        }
        _run();
        setInterval(_run, 4000);
    },
    runBuilder: function () {
        var me = this;
        me.createBuilder().run();
    },
    createBuilder: function () {
        var me = this;
        return Blend.create('Builder.commands.build.' + me.projectConfig.type + '.Builder', {
            options: me.options
        });
    }
});

