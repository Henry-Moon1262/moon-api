const pg = require('@/lib/pg');
const errors = require('@/lib/errors');
const router = require('express').Router();

router.get('/', (_, res) => res.pg(`
    select
        seq,
        title,
        status,
        remark,
        send_at,
        data,
        attachments,
        sent_at,
        created_at,
        updated_at,
        "to",
        cc,
        "from"
    from gcp_billing.email_delivery
    where deleted_at is null
`, { pagination: true, orders: ['seq', 'created_at'] }));

router.get('/:seq(\\d+)', (_, res) => res.pgOne(`
    select
        seq,
        title,
        html,
        status,
        remark,
        send_at,
        data,
        attachments,
        sent_at,
        created_at,
        updated_at,
        deleted_at,
        "to",
        cc,
        "from"
    from gcp_billing.email_delivery
    where seq = $(seq)
`));

router.post('/', async (req, res) => {
    const params = req.body;
    checkEmailDeliveryValidation(params);
    await pg.one(`
        insert into gcp_billing.email_delivery
            (title, html, status, remark, send_at, data, attachments, "to", cc, "from")
        values($(title), $(html), $(status), $(remark),
            $(send_at), $(data), $(attachments):: json[], $(to):: json[], $(cc):: json[], $(from))
        returning seq
    `, params);
    res.success({});
});

router.put('/:seq(\\d+)', async (req, res) => {
    const params = req.body;
    checkEmailDeliveryValidation(params);
    await pg.result(`
        update gcp_billing.email_delivery
        set
            title = $(title),
            html = $(html),
            status = $(status),
            remark = $(remark),
            send_at = $(send_at),
            data = $(data),
            attachments = $(attachments):: json[],
            sent_at = $(sent_at),
            updated_at = now(),
            "to" = $(to):: json[],
            cc = $(cc):: json[]
        where seq = $(seq)
    `, params);
    res.success({});
});

router.patch('/:seq(\\d+)', (_, res) => res.pgResult(`
    update gcp_billing.email_delivery
    set
        @{{ recipients = $(recipients), }}
        @{{ status = $(status), }}
        @{{ sent_at = $(sent_at), }}
        @{{ deleted_at = $(deleted_at), }}
        updated_at = now()
    where seq = $(seq)
`));

router.delete('/:seq(\\d+)', (_, res) => res.pgResult(`
    update gcp_billing.email_delivery
    set
    deleted_at = now()
    where seq = $(seq)
`));

function checkEmailDeliveryValidation(params) {
    if (params.status === 'ready') {
        if (params.title.length === 0) {
            errors.throw(errors.INVALID_PARAMETER, 'Title not found');
        }
        if (params.html.length === 0) {
            errors.throw(errors.INVALID_PARAMETER, 'Html content not found');
        }
        if (params.to.length === 0) {
            errors.throw(errors.INVALID_PARAMETER, 'Receivers not found');
        }
    }
}

module.exports = router;
