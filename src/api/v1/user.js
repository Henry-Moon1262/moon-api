const pg = require('@/lib/pg');
const errors = require('@/lib/errors');
const router = require('express').Router();
const { checkUserValidation, checkInvoiceTemplate } = require('@/lib/validations');

router.get('/', (_, res) => res.pg(`
    select
        seq,
        email,
        name,
        tel,
        remark,
        picture,
        type,
        loggedin_at,
        (
            select coalesce(array_to_string(array_agg(g.name), ', '),'')
            from gcp_billing.group_user gu
            join gcp_billing.group g on g.seq = gu.group_seq
            where gu.user_seq = u.seq
        ) groups,
        created_at,
        updated_at
    from gcp_billing.user u
`));

router.get('/:seq', (_, res) => res.pgOne(`
    select
        seq,
        email,
        name,
        tel,
        remark,
        picture,
        type,
        loggedin_at,
        (
            select array_agg(g.seq)
            from gcp_billing.group_user gu
            join gcp_billing.group g on g.seq = gu.group_seq
            where gu.user_seq = u.seq
        ) groups,
        created_at,
        updated_at
    from gcp_billing.user u
    where seq = $(seq)
`));

router.post('/', async (req, res) => {
    const params = req.body;

    checkUserValidation(params);

    await pg.result(`
            insert into gcp_billing.user (email, name, picture, type, tel, remark)
            values(lower(trim($(email))), $(name), $(picture), $(type), $(tel), $(remark))
            returning seq
    `, params)

    res.success({});
})

router.put('/:seq(\\d+)', async (req, res) => {
    const params = req.getParams();

    await pg.tx(async t => {
        await t.result(`
            update gcp_billing.user
            set
                name = $(name),
                email = lower(trim($(email))),
                type = $(type),
                tel = $(tel),
                remark = $(remark),
                updated_at = now()
            where seq = $(seq)
        `, params);

        await t.result(`
            delete from gcp_billing.group_user
            where user_seq = $(seq)
        `, params);

        if (params.groups.length > 0) {
            const values = pg.values(params.groups.map(item => ({
                user_seq: params.seq,
                group_seq: item,
            })), ['user_seq', 'group_seq']);

            await t.result(`
                insert into gcp_billing.group_user (${values.columns})
                values ${values.query}
            `, [...values.params]);
        }
    });

    return res.success({});
});

router.delete('/:seq', async (req, res) => {
    const params = req.getParams();

    const contractNames = await checkInvoiceTemplate(params);

    if (contractNames.length > 0) {
        return res.fail(errors.CANNOT_DELETE, `\nthe user is included in the invoice_template [${contractNames.join(', ')}]`);
    }

    await pg.tx(async t => {
        await t.result(`
            delete from gcp_billing.user
            where seq = $(seq)
        `, params);

        await t.result(`
            delete from gcp_billing.group_user
            where user_seq = $(seq)
        `, params);
    });
    return res.success({});
});

const getUserQuery = `
    select
        seq,
        email,
        name,
        tel,
        remark,
        picture,
        type,
        loggedin_at,
        (
            select json_agg(json_build_object('seq', g.seq, 'name', g.name))
            from gcp_billing.group_user gu
            join gcp_billing.group g on g.seq = gu.group_seq
            where gu.user_seq = u.seq
        ) groups,
        (
            select json_agg(json_build_object('id', a.id, 'name', a.name))
            from (
                select distinct a.id, a.name
                from gcp_billing.group_user gu
                join gcp_billing.group_account ga on ga.group_seq = gu.group_seq
                join gcp_billing.account a on a.id = ga.account_id
                where gu.user_seq = u.seq
                and a.active
            ) a
        ) accounts,
        (
            select array_agg(distinct gp.permission_id)
            from gcp_billing.group_user gu
            join gcp_billing.group_permission gp on gp.group_seq = gu.group_seq
            where gu.user_seq = u.seq
        ) permissions,
        (
            select data
            from gcp_billing.user_setting
            where user_seq = u.seq and category = 'global.user' and name = 'custom'
        ) custom,
        (
            select data
            from gcp_billing.user_setting
            where user_seq = u.seq and category = 'global.account' and name = 'custom'
        )last_account,      
        created_at,
        updated_at
    from gcp_billing.user u
    where u.email = $(email)
`;

router.get('/get_by_email/:email', async (req, res) => {
    res.success(await pg.one(getUserQuery, {
        email: req.params.email.toLowerCase(),
    }));
});

router.put('/login', async (req, res) => {
    if (!req.body.email) {
        return res.fail(errors.INVALID_PARAMETER, 'email parameter missing');
    }

    const params = {
        email: req.body.email.toLowerCase().trim(),
    };

    await pg.result(`
        insert into gcp_billing.user_setting
            (user_seq, category, name, data)
        select
            (select seq from gcp_billing.user where email = $(email)),
            'global.user',
            'custom',
            '{"locale": "en"}'
        on conflict (user_seq, category, name)
            do nothing
    `, params);

    await pg.result(`
        update gcp_billing.user
        set
            loggedin_at = now()
        where email = $(email)
    `, params);

    res.success(await pg.one(getUserQuery, params));
});

router.get('/:seq(\\d+)/invoice', (_, res) => res.pg(`
    select
        i.seq,
        contract_seq,
        c.name,
        c.company,
        invoice_month,
        currency,
        original_costs,
        original_cost,
        discount,
        cost,
        exchange_rate,
        vat,
        final_cost,
        status,
        merged_seqs,
        i.created_at,
        i.updated_at,
        i.deleted_at,
        c.charge_currency,
        c.to,
        c.cc
    from gcp_billing.invoice i
    join gcp_billing.contract c on i.contract_seq = c.seq
    where i.deleted_at is null
        and status = 'confirmed'
        and (contract_seq in (
	            select distinct seq
	            from gcp_billing.contract, unnest("to") t
	            where $(seq) = cast(t->>'seq' as int))
            or contract_seq in (
	            select distinct seq
	            from gcp_billing.contract, unnest("cc") c
	            where $(seq) = cast(c->>'seq' as int)))
`));

module.exports = router;