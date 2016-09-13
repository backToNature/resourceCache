
var stroage = (function () {
    // Some browser's privateMode will limit Stroage
    var lc;
    try {
        lc = win.localStorage;
    } catch (e) {

    }
}());