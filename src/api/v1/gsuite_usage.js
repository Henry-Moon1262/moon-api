const router = require('express').Router();

router.get('/:month/:size/:offset', (req, res) => {
    const params = req.params;
    const condition = `where invoice_month = '${params.month}' order by seq limit ${params.size} offset ${params.offset}`;
    res.pg(`
        select
            u.seq,
            u.invoice_month,
            u.account_id,
            a.name as account_name,
            u.sku_id,
            s.name as sku_name,
            u.desc,
            u.order_name,
            u.start_date,
            u.end_date,
            u.count,
            u.cost,
            u.currency,
            u.created_at
        from gcp_billing.gsuite_usage u
        inner join gcp_billing.account a
        on u.account_id = a.id
        inner join gcp_billing.gsuite_sku s
        on u.sku_id = s.id
        ${condition}
    `);
});

router.delete('/:seq', (_, res) => res.pgResult(`
    delete from gcp_billing.gsuite_usage
    where seq = $(seq)
`));

module.exports = router;