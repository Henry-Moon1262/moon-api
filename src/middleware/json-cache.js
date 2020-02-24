var NodeCache = require("node-cache");

function middleware(options) {
    options = options || {};

    var cache = new NodeCache(options.cache || {});
    var regex = new RegExp(options.match || ".*");

    return function (req, res, next) {
        next = next || (() => {});

        if (!res.json) return next();
        if (req.method != "GET") return next();
        if (!regex.test(req.originalUrl)) return next();

        const cacheKey = req.originalUrl;
        const cached = cache.get(cacheKey);
        if (cached) return res.json(cached);

        const _json = res.json;
        res.json = function (data) {
            if (res.disableJsonCache !== true) {
                cache.set(cacheKey, data);
            }

            return _json.call(res, data);
        };

        next();
    };
}

module.exports = middleware;