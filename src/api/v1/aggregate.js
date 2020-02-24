const router = require('express').Router();

router.get('/:account_id/:month/:type', (_, res) => res.pg(`
    select kind, data, projects
    from gcp_billing.aggregate
    where account_id = $(account_id)
        and month = $(month)
        and type = $(type)
    order by kind
`));

router.get('/:account_id/:month(\\d{6})', (_, res) => res.pg(`
    select type, kind, data
    from gcp_billing.aggregate
    where account_id = $(account_id)
        and month = $(month)
    order by type, kind
`));

router.get('/:account_id', (_, res) => res.pg(`
    select month, type, kind, data
    from gcp_billing.aggregate
    where account_id = $(account_id)
    order by month, type, kind
`));

router.get('/:month/:kind', (req, res) => res.pg(`
    select 
        account_id, 
        data
    from gcp_billing.aggregate
    where month = $(month)
    and kind = $(kind)
    order by account_id
    `)
);

module.exports = router;