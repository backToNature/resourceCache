    var path = {};
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

    var posixSplitPath = function (filename) {
        return splitPathRe.exec(filename).slice(1);
    };

    path.extname = function (path) {
        return posixSplitPath(path)[3];
    };

    path.basename = function (path, ext) {
        var f = posixSplitPath(path)[2];
        if (ext && f.substr(-1 * ext.length) === ext) {
            f = f.substr(0, f.length - ext.length);
        }
        return f;
    };