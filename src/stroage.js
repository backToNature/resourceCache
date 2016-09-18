

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

