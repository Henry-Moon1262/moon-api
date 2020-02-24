const router = require('express').Router();
const pg = require('@/lib/pg');
const errors = require('@/lib/errors');

router.get('/', (_, res) => res.pg(`
    select
        seq,
        "name",
        remark,
        title,
        created_at,
        updated_at,
        attachments
    from gcp_billing.email_template
`, { pagination: true, orders: ['seq', 'name', 'remark', 'title'] }));

router.get('/:seq(\\d+)', (_, res) => res.pgOne(`
    select
        seq,
        "name",
        remark,
        title,
        html,
        sample_data,
        created_at,
        updated_at,
        attachments
    from gcp_billing.email_template
    where seq = $(seq)
`));

router.post('/', (_, res) => res.pgResult(`
    insert into gcp_billing.email_template
        (name, remark, title, html, sample_data, attachments)
    values ($(name), $(remark), $(title), $(html), $(sample_data)::json, $(attachments)::json[])
`));

router.put('/:seq(\\d+)', (_, res) => res.pgResult(`
    update gcp_billing.email_template
    set
        name = $(name),
        remark = $(remark),
        title = $(title),
        html = $(html),
        sample_data = $(sample_data)::json,
        updated_at = now(),
        attachments = $(attachments)::json[]
    where seq = $(seq)
`));

router.delete('/:seq(\\d+)', async (req, res) => {
    const params = req.params;

    const findEmaileTemplate = await pg.any(`
            select
                distinct c.seq
            from gcp_billing.contract c
            join gcp_billing.email_template et
            on c.email_template_seq = et.seq
            where c.email_template_seq =  $(seq)
        `, params);

    if (findEmaileTemplate.length === 0) {
        await pg.result(`
        delete from gcp_billing.email_template
            where seq = $(seq)
        `, params);

        return res.success({});
    }

    const templateSeqs = findEmaileTemplate.map(e => e.seq);

    return res.fail(errors.NOT_PROCESS_DELETE, `The Invoice Temlpate numbers must be corrected(${templateSeqs.join(', ')})`);
});

module.exports = router;
