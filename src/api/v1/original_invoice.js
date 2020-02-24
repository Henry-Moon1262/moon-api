const router = require('express').Router();

router.get('/', (_, res) => res.pg(`
    select
        id,
        invoice_month,
        currency,
        meta,
        cost,
        @{{ case when upper($(include_items)) = 'Y' then items else null end items, }}
        @{{ case when upper($(include_summary)) = 'Y' then summary else null end summary, }}
        issued_date,
        due_date,
        created_at
    from gcp_billing.original_invoice
    where 1 = 1
        @{{ and invoice_month = $(invoice_month) }}
        @{{ and billing_id = $(billing_id) }}
`));

router.get('/:id', (_, res) => res.pgOne(`
    select
        id,
        invoice_month,
        currency,
        meta,
        cost,
        items,
        summary,
        issued_date,
        due_date,
        created_at
    from gcp_billing.original_invoice
    where id = $(id)
`));

module.exports = router;
