const pg = require('@/lib/pg');
const router = require('express').Router();

router.get('/', (_, res) => res.pg(`
    select
        old_id,
        a1.name old_name,
        new_id,
        a2.name new_name,
        migrated_at,
        m.created_at,
        m.updated_at
    from gcp_billing.account_migration m
    left join gcp_billing.account a1 on a1.id = m.old_id
    left join gcp_billing.account a2 on a2.id = m.new_id
`));

router.post('/', (_, res) => res.pgResult(`
    insert into gcp_billing.account_migration (old_id, new_id)
    values($(old_id), $(new_id))
`));

router.delete('/:old_id', (_, res) => res.pgResult(`
    delete from gcp_billing.account_migration
    where old_id = $(old_id)
`));

module.exports = router;
