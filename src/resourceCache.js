!(function () {
    var lc, storage, cacheList;
    // Some browser's privateMode will limit storage
    try {
        lc  = window.localStorage;
    } catch (e) {
        console.error(e);
    }

    if (lc) {
        storage = {};
        storage.get = function (key) {
            try {
                return lc.getItem(key);
            } catch (e) {
                return e;
            }
        };

        storage.set = function (key, value) {
            try {
                lc.setItem(key, value);
                return 'success';
            } catch (e) {
                return e;
            }
        };
    }

    // path
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

    // 执行css
    var execStyle = function (cssText) {
        var doc = window.document;
        var styleTag = doc.createElement("style");
        styleTag.setAttribute("type", "text/css");
        styleTag.innerHTML = cssText;
        doc.getElementsByTagName("head").item(0).appendChild(styleTag);
    };

    // 执行js
    var execScript = function (scriptText) {
        var script = document.createElement('script');
        var code = '!function(){' + scriptText + '\n}();';
        script.appendChild(document.createTextNode(code));
        document.head.appendChild(script);
    };

    var getKey = function (url) {
        var ext = path.extname(url),
            basename = path.basename(url, ext),
            item = basename + ':' + url.length;
        return item;
    };

    var setCache = function (url, text) {
        item = getKey();
        cacheList.push(item);
        storage.set('resourceCache:list', JSON.stringify(cacheList));
        storage.set(item, text);
    };

    var req = function (url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Accept', '*/*');
        xhr.withCredentials = true;

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                // path.extname(url) === '.js'? execScript(xhr.responseText) : execStyle(xhr.responseText);
                
                setCache(url, xhr.responseText);
            } else {
            }
        };
        xhr.onerror = function () {
            fn('error');
        };
        xhr.send();
    };

    var execCache = function (url) {
        var text;
        text = storage.get(getKey(url));
        path.extname(url) === '.js'? execScript(text) : execStyle(text);
    };

    var bindProp = 'data-cache';

    var getUrlList = function () {
        var urlList = [], temp = '[' + bindProp + '*="';
        document.querySelectorAll(temp + '.js"],' + temp + '.css"]').forEach(function (item) {
            temp = item.getAttribute(bindProp);
            path.extname(temp) === '.js' ? urlList.push(temp) : undefined;
            path.extname(temp) === '.css' ? urlList.push(temp) : undefined;
        });
        return urlList;
    };

    var list = getUrlList();

    var cacheList = storage.get('resourceCache:list');

    storage ? cacheList = cacheList ? cacheList = JSON.parse(cacheList) : cacheList = [] : cacheList = [];

    list.forEach(function (item) {
        if (cacheList.indexOf(getKey(item)) >= 0) {
            // match cache
            execCache(item);
        } else {
            req(item);
        }
    });

    execUrls(list);

}());