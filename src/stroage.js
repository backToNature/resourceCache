

    var lc, storage = {};
    try {
        lc  = window.localStorage;
    } catch (e) {
        console.error(e);
    }

    !lc ? storage.get = function () {
        return 'error';
    } : storage.get = function (key) {
        try {
            return lc.getItem(key);
        } catch (e) {
            return 'error';
        }
    };
    !lc ? storage.set = function () {
        return 'error';
    } : storage.set = function (key, value) {
        try {
            lc.setItem(key, value);
            return 'success';
        } catch (e) {
            return 'error';
        }
    };
    !lc ? storage.remove = function () {
        return 'error';
    } : storage.remove = function (key) {
        try {
            lc.removeItem(key);
            return 'success';
        } catch (e) {
            return 'error';
        }
    };



