

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