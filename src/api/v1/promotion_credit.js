const router = require('express').Router();

router.get('/:account_id', (_, res) => res.pg(`
    select 
        account_id,
        credit_id as id,
        c.name,
        remain_amount,
        original_amount,
        currency,
        expired_at
    from gcp_billing.promotion_credit p
    join gcp_billing.credit c
    on p.credit_id = c.id
    where 
        account_id = $(account_id)
    order by remain_amount desc
`));

router.get('/:account_id/:credit_id', (_, res) => res.pgOne(`
    select 
        account_id, 
        credit_id,
        name as credit_name, 
        remain_amount,
        original_amount,
        currency,
        expired_at
    from gcp_billing.promotion_credit p
    join gcp_billing.credit c
    on p.credit_id = c.id
    where 
        account_id = $(account_id)
    and credit_id = $(credit_id)
    order by remain_amount desc
`));

module.exports = router;