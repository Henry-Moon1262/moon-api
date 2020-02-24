function middleware() {
    return function (req, res, next) {
        const started = new Date();

        res.success = (data) => {
            console.log(
                req.method,
                req.originalUrl,
                JSON.stringify(req.body),
                (new Date()) - started,
                'OK',
            );

            return res.json(data);
        };

        res.fail = (errorCode, errorData) => {
            console.error(
                req.method,
                req.originalUrl,
                JSON.stringify(req.body),
                (new Date()) - started,
                errorCode,
                errorData,
            );

            errorData = (process.env.NODE_ENV === 'production') ? 'Internal Server Error' : errorData;

            return res.json({
                errorCode,
                errorData
            });
        };

        next && next();
    }
}

module.exports = middleware;