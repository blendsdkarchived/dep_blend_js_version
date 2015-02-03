/**
 * Command class that is responsible for building a blendjs application
 */
Blend.defineClass('Builder.commands.build.Command', {
    extend: 'Builder.commands.Base',
    reqtires: [
        'Builder.commands.build.webapp.Develop'
    ],
    run: function () {
        var me = this;
        if (me.options.watch === true) {
            me.runWithWatcher();
        } else {
            me.getFolderWatcher().update();
            me.runBuilder();
        }
    },
    /**
     * Creates and starts an internal webserver (Express) to serve the build
     * folder
     * @returns {undefined}
     */
    startExpress: function () {
        var me = this;
        if (!me.options.noserve) {
            var express = require('express');
            var portfinder = require('portfinder');
            var open = require('open');
            var app = express();
            var servePath = Blend.fixPath(FileUtils.dirname(me.options.path) + '/build');
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
    },
    /**
     * Executes the runBuilder function in an interval of 4 seconds. It starts
     * the Express webserver after the first run
     * @returns {undefined}
     */
    runWithWatcher: function () {
        var me = this,
                working = false;
        _run = function () {
            if (working === false) {
                working = true;
                me.getFolderWatcher().update();
                if (me.getFolderWatcher().isChanged()) {
                    Logger.clearErrors();
                    me.runBuilder();
                }
                working = false;
            }
        };
        _run();
        me.startExpress();
        setInterval(_run, 4000);
    },
    /**
     * Creates a folder watcher. The folder watcher is actually used as a simple
     * cache. The real watching is done in this class using the setInterval function
     * @returns {unresolved}
     */
    getFolderWatcher: function () {
        var me = this;
        if (!me.watcher) {
            me.watcher = Blend.create('Builder.utils.FolderWatcher', {
                root: [me.getProjectPath(), Blend.getSDKFolder()],
                extensions: ['.js', '.css', '.xml', '.json', '.rb', '.html']
            });
        }
        return me.watcher;
    },
    /**
     * Runs one of the builders based on project configuration
     * @returns {Boolean}
     */
    runBuilder: function () {
        var me = this, className, builder;
        if (me.loadProjectConfiguration()) {
            className = 'Builder.commands.build.' + me.project.type + '.' + (me.options.release === true ? 'Release' : 'Develop');
            builder = Blend.create(className, {
                options: me.options,
                project: me.project,
                watcher: me.getFolderWatcher()
            });
            builder.run();
        } else {
            me.exit();
            return false;
        }
    },
    /**
     * Gets the path of current project
     * @returns {undefined}
     */
    getProjectPath: function () {
        var me = this,
                p = me.options.path.split('/'),
                last = p[p.length - 1];
        if (last.indexOf('.json') !== -1) {
            p.pop();
        }
        return  Blend.fixPath(p.join('/'));
    },
    /**
     * Loads the project configuration file
     * @returns {Boolean}
     */
    loadProjectConfiguration: function () {
        var me = this;
        try {
            me.project = null;
            me.initProject(me.getProjectPath());
            return me.project.loadFromFile(me.options.path);
        } catch (e) {
            Logger.error(e);
            me.exit();
            return false;
        }
    }
});

