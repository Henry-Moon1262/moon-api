const errors = require('@/lib/errors');

function middleware() {
    return function (err, _, res, next) {
        if (!err) {
            next && next(err);
            return;
        }

        if (err.code) {
            return res.fail(err.code, err.message);
        }

        return res.fail(errors.UNKNOWN, err.message || err);
    }
}

module.exports = middleware;