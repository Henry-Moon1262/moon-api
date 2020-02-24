const router = require('express').Router();

router.get('/:seq(\\d+)', (_, res) => res.pgOne(`
    select
        i.seq,
        i.contract_seq,
        i.invoice_month,
        i.cost,
        i.exchange_rate,
        i.vat,
        i.final_cost,
        i.usage_data,
        i.status,
        i.created_at,
        i.deleted_at,
        c.name,
        c.company
    from gcp_billing.gsuite_invoice i
    inner join gcp_billing.contract c
    on c.seq = i.contract_seq
    where i.seq = $(seq) and i.deleted_at is null
`));

router.get('/invoice/:month', (_, res) => res.pg(`
    select
        i.seq,
        i.contract_seq,
        i.invoice_month,
        i.cost,
        i.exchange_rate,
        i.vat,
        i.final_cost,
        i.usage_data,
        i.status,
        i.created_at,
        i.deleted_at,
        c.name,
        c.company
    from gcp_billing.gsuite_invoice i
    inner join gcp_billing.contract c
    on c.seq = i.contract_seq
    where i.invoice_month = $(month) and i.deleted_at is null
`));

router.put('/:seq', (_, res) => res.pgResult(`
    update gcp_billing.gsuite_invoice
    set status = $(status)
    where seq = $(seq) and deleted_at is null
`));

router.delete('/:seq', (_, res) => res.pgResult(`
    update gcp_billing.gsuite_invoice
    set deleted_at = now()
    where seq = $(seq) and deleted_at is null
`));

module.exports = router;