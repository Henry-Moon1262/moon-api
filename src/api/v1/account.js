const pg = require('@/lib/pg');
const router = require('express').Router();

router.get('/', (_, res) => res.pg(`
    select
        id,
        name,
        description,
        created_at,
        updated_at,
        master_id,
        active
    from gcp_billing.account
    where 1 = 1
        @{{ and active = $(active) }}
`));

router.get('/:id', (_, res) => res.pgOne(`
    select
        id,
        name,
        description,
        created_at,
        updated_at,
        active
    from gcp_billing.account
    where id = $(id)
`));

router.get('/:id/projects', (_, res) => res.pg(`
    select
        id,
        name,
        account_id,
        created_at,
        updated_at
    from gcp_billing.project
    where account_id = $(id)
`));

router.get('/:id/invoices', (_, res) => res.pg(`
    select
        seq,
        account_id,
        "month",
        ref_id,
        total_cost,
        created_at,
        updated_at
    from gcp_billing.invoice
    where account_id = $(id)
`));


router.post('/', (_, res) => res.pgResult(`
    insert into gcp_billing.account(id, name, description)
    values($(id), $(name), $(description))
`));

router.put('/:id', async (_, res) => res.pgResult(`
    update gcp_billing.account
    set
        name = $(name),
        description = $(description),
        updated_at = now(),
        active = $(active)
    where id = $(id)
`));

router.delete('/:id', async (req, res) => {
    const params = req.getParams();

    await pg.tx(async t => {
        await t.result(`
            delete from gcp_billing.account
            where id = $(id)
        `, params);

        await t.result(`
            delete from gcp_billing.group_account
            where account_id = $(id)
        `, params);
    });

    return res.success({});
});

module.exports = router;