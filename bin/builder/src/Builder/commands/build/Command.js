var ms = require("mustache");
var path = require("path");
var fs = require("fs");

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

        if (!me.options.noserve) {

            var express = require('express');
            var portfinder = require('portfinder');
            var open = require('open');
            var app = express();
            var servePath = path.dirname(me.options.path) + path.sep + 'build';
            app.use(express.static(servePath));

            portfinder.basePort = 8080;
            portfinder.getPort(function (err, port) {
                console.log("Listening to port:" + port);
                console.log("Happy BlendJS Developing :)");
                console.log("Press CTRL-C to stop the local webserver.");
                open("http://127.0.0.1:" + port);
                app.listen(port);
            });
        }

        _run = function () {
            if (working === false) {
                working = true;
                Logger.clearErrors();
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
        return Blend.create('Builder.commands.build.' + me.project.type + '.Builder', {
            options: me.options
        });
    }
});

