const pg = require('@/lib/pg');
const router = require('express').Router();

router.get('/', (_, res) => res.pg(`
    select
        seq,
        name,
        type,
        (
    	    select
    		    json_agg(st.name)
    	    from
                (select 
                    ga.group_seq,
                    a.name
                from gcp_billing.group_account ga
                join gcp_billing.account a
                on ga.account_id = a.id where a.active)st
		    where st.group_seq=seq
    	)accounts,
        description,
        created_at,
        updated_at
    from gcp_billing.group
`));

router.get('/:seq', (_, res) => res.pgOne(`
    select
        seq,
        name,
        description,
        type,
        (
            select array_agg(account_id)
            from gcp_billing.group_account
            where group_seq = g.seq
        ) accounts,
        (
            select array_agg(permission_id)
            from gcp_billing.group_permission
            where group_seq = g.seq
        ) permissions,
        created_at,
        updated_at
    from gcp_billing.group g
    where seq = $(seq)
`));

router.post('/', (_, res) => res.pgOne(`
    insert into gcp_billing.group (name, description, type)
    values($(name), $(description), $(type))
    returning seq
`));

router.put('/:seq', async (req, res) => {
    const params = req.getParams();

    await pg.tx(async t => {
        await t.result(`
            update gcp_billing.group
            set
                name = $(name),
                description = $(description),
                type = $(type)
            where seq = $(seq)
        `, params);

        if (params.accounts.length > 0) {
            await t.result(`
                delete from gcp_billing.group_account
                where group_seq = $(seq) and account_id not in ($(accounts:csv))
            `, params);

            const values = pg.values(params.accounts.map(item => ({
                group_seq: params.seq,
                account_id: item,
            })), ['group_seq', 'account_id']);

            await t.result(`
                insert into gcp_billing.group_account (${values.columns})
                values ${values.query}
                on conflict (${values.columns}) do nothing
            `, [...values.params]);
        } else {
            await t.result(`
                delete from gcp_billing.group_account
                where group_seq = $(seq)
            `, params);
        }

        if (params.permissions.length > 0) {
            await t.result(`
                delete from gcp_billing.group_permission
                where group_seq = $(seq) and permission_id not in ($(permissions:csv))
            `, params);

            const values = pg.values(params.permissions.map(item => ({
                group_seq: params.seq,
                permission_id: item,
            })), ['group_seq', 'permission_id']);

            await t.result(`
                insert into gcp_billing.group_permission (${values.columns})
                values ${values.query}
                on conflict (${values.columns}) do nothing
            `, [...values.params]);
        } else {
            await t.result(`
                delete from gcp_billing.group_permission
                where group_seq = $(seq)
            `, params);
        }
    });

    return res.success({});
});

router.delete('/:seq', async (req, res) => {
    const params = req.getParams();

    await pg.tx(async t => {
        await t.result(`
            delete from gcp_billing.group
            where seq = $(seq)
        `, params);

        await t.result(`
            delete from gcp_billing.group_permission
            where group_seq = $(seq)
        `, params);
    });

    return res.success({});
});

module.exports = router;