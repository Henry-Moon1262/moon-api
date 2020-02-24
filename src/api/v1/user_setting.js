const pg = require('@/lib/pg');
const router = require('express').Router();

const listColumns = `
        user_seq,
        category,
        name,
        data,
        created_at,
        updated_at
`;

router.get('/:user_seq', (_, res) => res.pg(`
    select
        ${listColumns}
    from gcp_billing.user_setting
    where user_seq = $(user_seq)
`));

router.get('/:user_seq/:category', (_, res) => res.pg(`
    select
        ${listColumns}
    from gcp_billing.user_setting
    where user_seq = $(user_seq)
        and category = $(category)
`));

router.get('/:user_seq/:category/:name', (_, res) => res.pgOne(`
    select
        ${listColumns},
        data
    from gcp_billing.user_setting
    where user_seq = $(user_seq)
        and category = $(category)
        and name = $(name)
`));

router.post('/:user_seq/:category', (_, res) => res.pgResult(`
    insert into gcp_billing.user_setting (user_seq, category, name, data)
    values($(user_seq), $(category), $(name), $(data))
`));

router.put('/:user_seq/:category/:name', async (req, res) => {
    const params = req.getParams();

    //  신규 설정일경우만 insert 중복건에대해서는 update로 변경
    await pg.result(`
            insert into gcp_billing.user_setting AS US
            (user_seq, category, name, data)
            values
            ($(user_seq), $(category), $(name), $(data)::json)
            on conflict (user_seq, category, name)
            do update
                set
                    data = excluded.data::json,
                    updated_at = now()    
        `, params);

    return res.success({ updatedSession: true });
})

router.put('/:user_seq/:category/:name/name', (_, res) => res.pgResult(`
    update gcp_billing.user_setting
    set
        name = $(new_name),
        updated_at = now()
    where user_seq = $(user_seq)
        and category = $(category)
        and name = $(name)
`));

router.delete('/:user_seq/:category', (_, res) => res.pgResult(`
    delete from gcp_billing.user_setting
    where user_seq = $(user_seq)
        and category = $(category)
`));

router.delete('/:user_seq/:category/:name', (_, res) => res.pgResult(`
    delete from gcp_billing.user_setting
    where user_seq = $(user_seq)
        and category = $(category)
        and name = $(name)
`));

module.exports = router;
