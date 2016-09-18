/*!
 * resourceCache - Resource Cache Engine
 * https://github.com/backToNature/resourceCache
 * Released under the MIT, BSD, and GPL Licenses
 */

!(function () {
    
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

    var lc, stroage = {};
    try {
        lc  = window.localStorage;
    } catch (e) {
        console.error(e);
    }

    !lc ? stroage.get = function () {
        return 'error';
    } : stroage.get = function (key) {
        try {
            return lc.getItem(key);
        } catch (e) {
            return 'error';
        }
    };
    !lc ? stroage.set = function () {
        return 'error';
    } : stroage.set = function (key, value) {
        try {
            lc.setItem(key, value);
            return 'success';
        } catch (e) {
            return 'error';
        }
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


    var request = function (url, fn) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Accept', '*/*');
        xhr.withCredentials = true;

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                // path.extname(url) === '.js'? execScript(xhr.responseText) : execStyle(xhr.responseText);
                fn(xhr.responseText);
                // setCache(url, xhr.responseText);
            } else {
                fn('error');
            }
        };
        xhr.onerror = function () {
            fn('error');
        };
        xhr.send();
    };



    var getCacheList = function () {
        var _cacheList = stroage.get('resourceCache:list')
        if (_cacheList !== 'error' && _cacheList) {
            _cacheList = JSON.parse(_cacheList);
        } else {
            _cacheList = [];
        }
        return _cacheList;
    };

    var getKey = function (url) {
        var ext = path.extname(url),
            basename = path.basename(url, ext),
            item = basename + ':' + url.length;
        return item;
    };

    var matchCache = function (url) {
        var cacheList = getCacheList();
        return cacheList.indexOf(getKey(url)) >= 0 ? true : false;
    };

    var setCache = function (url, text) {
        var cacheList = getCacheList();
        key = getKey(url);
        cacheList.push(key);
        stroage.set('resourceCache:list', JSON.stringify(cacheList)) === 'error' ? stroage.set('resourceCache:list', null): undefined;
        stroage.set(key, text) === 'error'? stroage.set(key, null) : undefined;
    };

    var getResource = function (url, fn) {
        var key = getKey(url), text;
        var reqRes = function () {
            request(url, function (text) {
                if (text !== 'error') {
                    setCache(url, text);
                    fn(text);
                } else {
                    fn('error');
                }
            });
        };
        if (matchCache(url)) {
            text = stroage.get(key);
            if (text === 'error') {
                reqRes();
            } else {
                fn(text);
            }
        } else {
            reqRes();
        }
    };


    var getUrlList = function (bindProp) {
        var urlList = [], temp = '[' + bindProp + '*="';
        document.querySelectorAll(temp + '.js"],' + temp + '.css"]').forEach(function (item) {
            temp = item.getAttribute(bindProp);
            path.extname(temp) === '.js' ? urlList.push(temp) : undefined;
            path.extname(temp) === '.css' ? urlList.push(temp) : undefined;
        });
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
                    if (typeof val === 'string') {
                        path.extname(val.url) === '.js' ? execScript(val) : execStyle(val);
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


    if (typeof define === 'function') {
        define(function() {
            return ResourceCache;
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = ResourceCache;
    } else {
        this.ResourceCache = ResourceCache;
    }
}());