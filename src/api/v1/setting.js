const router = require('express').Router();

router.get('/', (_, res) => res.pgOne(`
    select
        seq,
        data,
        created_at
    from gcp_billing.setting
    order by seq desc
    limit 1
`));

router.put('/', (_, res) => res.pgResult(`
    insert into gcp_billing.setting (data)
    values ($(data))
`));

router.get('/history', (req, res) => {
    const offset = req.getParam('offset', /\d+/, 0);
    const size = req.getParam('size', /\d+/, 100);

    return res.pg(`
        select
            seq,
            data,
            created_at
        from gcp_billing.setting
        order by seq desc
        offset ${offset}
        limit ${size}
    `);
});

router.get('/history/:seq(\\d+)', (_, res) => res.pgOne(`
    select
        seq,
        data,
        created_at
    from gcp_billing.setting
    where seq = $(seq)
`));

router.put('/restore/:seq(\\d+)', (_, res) => res.pgResult(`
    insert into gcp_billing.setting (data)
    select data
    from gcp_billing.setting
    where seq = $(seq)
`));

module.exports = router;
