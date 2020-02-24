const router = require('express').Router();

router.get('/', (_, res) => res.pg(`
    select
        id,
        name,
        created_at,
        updated_at
    from gcp_billing.service
`));

router.get('/:id', (_, res) => res.pgOne(`
    select
        id,
        name,
        created_at,
        updated_at
    from gcp_billing.service
    where id = $(id)
`));

module.exports = router;