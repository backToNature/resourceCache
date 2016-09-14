var path = {};

var posixSplitPath = function (filename) {
    return splitPathRe.exec(filename).slice(1);
};

path.extname = function (path) {
    return posixSplitPath(path)[3];
};