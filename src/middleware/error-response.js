function middleware(name, errorCode) {
    return function (_, res, next) {
        res[name] = () => {
            return res.fail(errorCode);
        };

        next && next();
    }
}

module.exports = middleware;