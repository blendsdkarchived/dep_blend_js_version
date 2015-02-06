var fs = require('fs');
var path = require('path');
var root = __dirname + '/../';
var mroot = root + '/node_modules';
var bcsroot = mroot + "/blend-class-system/lib";
var srcroot = root + "/src";
/**
 * Fixed the path per OS
 * @param {type} pth
 */
var fixPath = function (pth) {
    return pth.replace(/\\/g, path.sep);
};

/**
 * Helper copy function
 * @param {type} srcFile
 * @param {type} destFile
 */
var copyFile = function (srcFile, destFile) {

    var srcContent = fs.readFileSync(fixPath(srcFile)).toString();
    fs.writeFileSync(fixPath(destFile), srcContent);
};

/**
 * Start copy files;
 */
copyFile(bcsroot + "/Blend.js", srcroot + "/js/core/Blend.js");
copyFile(bcsroot + "/ClassBuilder.js", srcroot + "/js/core/ClassBuilder.js");
