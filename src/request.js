


    var request = function (url, fn) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Accept', '*/*');
        xhr.withCredentials = true;

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                fn(xhr.responseText);
            } else {
                fn('error');
            }
        };
        xhr.onerror = function () {
            fn('error');
        };
        xhr.send();
    };

