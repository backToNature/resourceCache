var fs = require('fs');
var path = require('path');

var fileIndex = ['head-intro.js', 'path.js', 'stroage.js', 'eval.js', 'request.js', 'cache.js', 'core.js', 'footer.js'];

var sPath = path.join(__dirname, './src');
var dPath = path.join(__dirname, './dist/dist.js')

fs.writeFileSync(dPath, '', 'utf8');

var compile = function () {
    fs.writeFileSync(dPath, '', 'utf8');
    fileIndex.forEach(function (item) {
        fs.appendFileSync(dPath, fs.readFileSync(path.join(sPath, item), 'utf8'));
    });
};

var watch = function () {
    compile();
    fs.watch(sPath, function (e, filename) {
        if (fileIndex.indexOf(filename) >= 0 && e === 'change') {
            compile();
            console.log('compile finish');
        }
    });
    console.log('watch start');
};

watch();