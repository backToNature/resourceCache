
var stroage = (function () {
    // Some browser's privateMode will limit Stroage
    var lc;
    try {
        return win.localStorage;
    } catch (e) {

    }
}());

