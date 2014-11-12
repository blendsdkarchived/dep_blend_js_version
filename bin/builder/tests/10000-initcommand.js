var fs = require('fs');
/**
 * Just a simple directory creation test if this goes ok then no need to
 * test deeper
 */
BlendTest.defineTest('init-command', 'new-project', function (t) {
    var options = {
        projectName: 'MyProject_' + (new Date()).getTime() / 1000,
        path: process.cwd() + "/tmp",
        className: 'Test' + (new Date())
    }

    var initCommand = Blend.create('Builder.commands.init.Command', {
        options: options
    });
    initCommand.run();
    try {
        var status = fs.statSync(initCommand.projectFolder);
        t.isTrue(status.isDirectory(), initCommand.projectFolder + " created");
        t.done();
    } catch (e) {
        t.isFalse(true, 'failed to create project folder');
        t.done();
    }
});