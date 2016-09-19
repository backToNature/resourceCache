

    var getCacheList = function () {
        var _cacheList = storage.get('resourceCache:list')
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
        storage.set('resourceCache:list', JSON.stringify(cacheList)) === 'error' ? storage.remove('resourceCache:list'): undefined;
        storage.set(key, text) === 'error'? storage.remove(key) : undefined;
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
            text = storage.get(key);
            if (text === 'error') {
                reqRes();
            } else {
                fn(text);
            }
        } else {
            reqRes();
        }
    };

    var clearCache = function (key) {
        var cacheList = getCacheList(),
            index = cacheList.indexOf(key);
        if (index) {
            storage.remove(key);
            cacheList.splice(index, 1);
            storage.set('resourceCache:list', JSON.stringify(cacheList)) === 'error' ? storage.remove('resourceCache:list'): undefined;
        }
    };
