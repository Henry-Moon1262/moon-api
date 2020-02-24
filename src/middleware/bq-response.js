var bq = require('@google-cloud/bigquery');
const config = require('@/config');

function middleware() {
    return function (req, res, next) {
        res.bq = (query, filter) => {
            var bqClient = new bq.BigQuery({
                projectId: config.gcp.projectId,
            });

            bqClient.query({
                query: query,
                params: Object.assign({}, req.params, req.query, req.body),
            }).then(ret => {
                filter = filter || (p => p);
                return res.success(filter(ret[0]));
            }).catch(err => {
                return res.fail(err);
            });
        };

        next && next();
    };
}

module.exports = middleware;