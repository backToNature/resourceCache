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