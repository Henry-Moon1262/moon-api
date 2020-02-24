const router = require('express').Router();

router.get('/:account_id/:user_seq', (_, res) => res.pg(`
    select
        seq,
        type,
        a.name,
        setting,
        user_seq,
        account_id,
        data,
        target
    from gcp_billing.alarm a
    where 
        account_id=$(account_id)
        and user_seq=$(user_seq)
    order by seq desc
`));

router.get('/:account_id/:user_seq/:seq', (_, res) => res.pgOne(`
    select
        seq,
        type,
        name,
        setting,
        user_seq,
        account_id,
        data,
        target
    from gcp_billing.alarm
    where seq = $(seq)
`));

router.post('/:account_id', (_, res) => res.pgResult(`
    insert into gcp_billing.alarm(type, name, data, setting, user_seq, account_id, target)
    values($(type), $(name), $(data)::json, $(setting)::json, $(user_seq), $(account_id), $(target))
`));

router.put('/:account_id/:seq', (_, res) => res.pgResult(`
    update gcp_billing.alarm 
    set
        name = $(name),
        data = $(data),
        updated_at = now(),
        setting = $(setting)::json,
        target = $(target)
    where seq = $(seq)
`));

router.delete('/:account_id/:seq', async (_, res) => res.pgResult(`
    delete from gcp_billing.alarm
    where seq = $(seq)
`));

module.exports = router;