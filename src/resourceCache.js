!(function () {
    var lc, stroage, cacheList;
    // Some browser's privateMode will limit Stroage
    try {
        lc  = window.localStorage;
    } catch (e) {
        console.error(e);
    }

    if (lc) {
        stroage = {};
        stroage.get = function () {
            try {
                return lc.getItem(key);
            } catch (e) {
                return e;
            }
        };

        stroage.set = function (key, value) {
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
        // try {
            // eval.call(window, scriptText);
        // } catch (e) {
        //     console.error(e);
        // }


    };

    // var req = function (url, cb) {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', url, true);
    //     xhr.setRequestHeader('Accept', '*/*');
    //     xhr.withCredentials = true;
    //     if (list.indexOf(url) >= 0) {
    //         // 在list表中
    //         if (path.extname(url) === '.css') {
    //             createStyle()
    //         } else if (path.extname(url) === '.js') {
    //             eval.call
    //         }
    //         eval.call(window, localStorage.getItem('ResourceCache-' + list.indexOf(url)));
    //         xhr = null;
    //     } else {
    //         // 不在list表中
    //         xhr.onload = function() {
    //             if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
    //                 list.push(url);
    //                 lc.setItem('ResourceCache-list', JSON.stringify(list));
    //                 localStorage.setItem('ResourceCache-' + list.indexOf(url), xhr.responseText);
    //                 eval.call(window, xhr.responseText);
    //             }
    //         };
    //         xhr.onerror = function () {

    //         };
    //         xhr.send();
    //     }
    // };

    var req = function (url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Accept', '*/*');
        xhr.withCredentials = true;

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                path.extname(url) === '.js' ? execScript(xhr.responseText) : execStyle(xhr.responseText);
            }
        };

        xhr.onerror = function () {

        };
        xhr.send();
        // var doc = document,
        //     head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement,
        //     script = doc.createElement("script");
        // script.type = "text/javascript";
        // script.charset = "utf-8";
        // script.onload = function () {
        //     // dtd.resolve();
        //     // callback && callback.call(this);
        // };
        // script.src = url;
        // head.insertBefore(script, head.firstChild);
    };

    var cacheExec = function (url) {

    };

    var bindProp = 'data-cache';


    var getUrlList = function () {
        var urlList = [], temp = '[' + bindProp + '*="';

        document.querySelectorAll(temp + '.js"],' + temp + '.css"]').forEach(function (item) {
            temp = item.getAttribute(bindProp);
            path.extname(temp) === '.js' ? urlList.push(temp) : undefined;
            // path.extname(temp) === '.css' ? urlList.push(temp) : undefined;
        });
        return urlList;
    };

    var list = getUrlList();

    list.forEach(function (item) {
        req(item);
    });
    if (stroage) {

    } else {
        req([]);
    }
    
    // req('./test.js');

}());