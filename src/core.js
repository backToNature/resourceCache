
    var getUrlList = function (bindProp) {
        var urlList = [], temp = '[' + bindProp + '*="', i, item
            sets = document.querySelectorAll(temp + '.js"],' + temp + '.css"]');
        for (i = 0; i < sets.length; i++) {
            item = sets[i];
            temp = item.getAttribute(bindProp);
            path.extname(temp) === '.js' ? urlList.push(temp) : undefined;
            path.extname(temp) === '.css' ? urlList.push(temp) : undefined;
        }
        return urlList;
    };

    var ResourceCache = {};

    ResourceCache.getScript = function (url, fn) {
        if (path.extname(url) !== '.js') {
            console.error('extname invaild');
            return;
        }
        getResource(url, function (text) {
            if (text !== 'error') {
                execScript(text);
                if (fn) {
                    fn();
                }
            }
        });
    };

    ResourceCache.getStyle = function (url, fn) {
        if (path.extname(url) !== '.css') {
            console.error('extname invaild');
            return;
        }
        getResource(url, function (text) {
            if (text !== 'error') {
                execStyle(text);
                if (fn) {
                    fn();
                }
            }
        });
    };

    ResourceCache.clear = function () {

    };

    ResourceCache.clearAll = function () {

    };

    ResourceCache.getUrls = function (urlList) {
        var readyLen = 0, indexObj = {};

        var ready = function () {
            var flag = false, j = 0, val;
            if (readyLen === urlList.length) {
                for (j = 0; j < readyLen ; j ++) {
                    val = indexObj[j.toString()];
                    if (typeof val.text === 'string') {
                        path.extname(val.url) === '.js' ? execScript(val.text) : execStyle(val.text);
                    }
                }
            }
        };
        urlList.forEach(function (item) {
            getResource(item, function (text) {
                text === 'error' ? text = '' : undefined;
                readyLen++;
                var temp = {
                    text: text,
                    url: item
                };
                indexObj[urlList.indexOf(item).toString()] = temp;
                ready();
            });
        });
    };

    ResourceCache.init = function (option) {
        bindProp = option.bindProp || 'data-cache';
        var urlList = getUrlList(bindProp);
        this.getUrls(urlList);
    };