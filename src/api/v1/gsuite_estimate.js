const router = require('express').Router();

router.get('/', (_, res) => res.pg(`
  select
    e.seq,
    e.month,
    e.sub_id,
    e.sku_id,
    k.name as sku_name,
    e.account_id,
    a.name as account_name,
    e.plan_name,
    e.plan_end_time,
    s.seats->'licensedNumberOfSeats' as seats,
    e.created_at,
    e.updated_at,
    e.sent_at
  from gcp_billing.gsuite_estimate e
  inner join gcp_billing.gsuite_sub s
  on e.sub_id = s.id
  inner join gcp_billing.gsuite_sku k  
  on e.sku_id = k.id
  inner join gcp_billing.account a
  on e.account_id = a.id
  where month = $(month)
`));

module.exports = router;