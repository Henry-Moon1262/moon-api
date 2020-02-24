const router = require('express').Router();

router.get('/', (_, res) => res.pg(`
    select
        id,
        name,
        account_id,
        created_at,
        updated_at
    from gcp_billing.project
`));

router.get('/:id', (_, res) => res.pgOne(`
    select
        id,
        name,
        account_id,
        created_at,
        updated_at
    from gcp_billing.project
    where id = $(id)
`));

module.exports = router;