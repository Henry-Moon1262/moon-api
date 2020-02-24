const pg = require('@/lib/pg');

function pgCaller(fn, req, res) {
    return (query, filter, options) => {
        const params = Object.assign({}, req.params, req.query, req.body);

        if (typeof filter === 'object') {
            options = filter;
            filter = null;
        }

        fn(query, params, options).then(ret => {
            filter = filter || (p => p);
            return res.success(filter(ret));
        }).catch(err => {
            return res.fail('DBERROR', err.message);
        });
    };
}

function middleware() {
    return function (req, res, next) {
        res.pg = pgCaller(pg.any, req, res);
        res.pgOne = pgCaller(pg.oneOrNone, req, res);
        res.pgResult = pgCaller(pg.result, req, res);

        next && next();
    };
}

module.exports = middleware;