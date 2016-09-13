!(function (win) {
    var lc = win.localStorage;
    var list = JSON.parse(lc.getItem('ResourceCache-list')) || [];

    var Storage = {
        
    };


    var createStyle = function (cssText) {
        var doc = win.document;
        var styleTag = doc.createElement("style");
        styleTag.setAttribute("type", "text/css");
        styleTag.innerHTML = cssText;
        doc.getElementsByTagName("head").item(0).appendChild(styleTag);
    };


    var req = function (url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Accept', '*/*');
        xhr.withCredentials = true;
        if (list.indexOf(url) >= 0) {
            // 在list表中
            eval.call(window, localStorage.getItem('ResourceCache-' + list.indexOf(url)));
            xhr = null;
        } else {
            // 不在list表中
            xhr.onload = function() {
                if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    list.push(url);
                    lc.setItem('ResourceCache-list', JSON.stringify(list));
                    localStorage.setItem('ResourceCache-' + list.indexOf(url), xhr.responseText);
                    eval.call(window, xhr.responseText);
                }
            };
            xhr.onerror = function () {

            };
            xhr.send();
        }

    };



    req('./test.js');

}(window));