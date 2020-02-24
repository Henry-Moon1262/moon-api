const router = require('express').Router();
const moment = require('moment');

const tagFields = [].concat(
    ['machine_spec', 'cores', 'memory']
        .map(v => 't_system_' + v),
    ['owner', 'project', 'server', 'status', 'user', 'application', 'name',
        'service', 'environment', 'phase', 'role', 'revision', 'team']
        .map(v => 't_user_' + v),
);

const selectQuery = `
    select
        project_id,
        p.name project_name,
        service_id,
        s.name service_name,
        sku_id,
        k.name sku_name,
        invoice_month,
        location,
        country,
        c.name country_name,
        region,
        zone,
        cost_type,
        usage_unit,
        to_char(usage_date, 'YYYY-MM-DD') usage_date,
        currency,
        currency_conversion_rate,
        ${tagFields.join(',')},
        usage,
        cost,
        credit
    from gcp_billing.usage_daily u
    left join gcp_billing.project p on p.id = u.project_id and p.account_id = u.account_id
    left join gcp_billing.service s on s.id = u.service_id
    left join gcp_billing.sku k on k.id = u.sku_id
    left join gcp_billing.country c on c.id = u.country
`;

function removeEmptyTags(rows) {
    return rows.map(row => {
        tagFields.forEach(t => {
            if (row[t] === '') {
                delete row[t];
            }
        });
        return row;
    });
}

router.get('/:account_id/:month(\\d{6})', (_, res) => res.pg(`
    ${selectQuery}
    where u.account_id = $(account_id)
    and invoice_month = $(month)
`, removeEmptyTags));

router.get('/:account_id/:start_date(\\d{8})/:end_date(\\d{8})', (_, res) => res.pg(`
    ${selectQuery}
    where u.account_id = $(account_id)
        and usage_date >= to_date($(start_date), 'YYYYMMDD')
        and usage_date < to_date($(end_date), 'YYYYMMDD') + 1
`, removeEmptyTags));

router.get('/:account_id/months/:month(\\d{6})/:period', (req, res) => {
    let month = moment(req.getParam('month'), 'YYYYMM');
    const period = parseInt(req.getParam('period', /\d+/, 1));
    const months = [];
    for (let i = 0; i < period; i += 1) {
        months.push(`'${month.format('YYYYMM')}'`);
        month = month.add(1, 'months');
    }
    const conditionQuery = `and invoice_month in (${months.join(',')})`;
    return res.pg(`
        ${selectQuery}
        where u.account_id = $(account_id)
        ${conditionQuery}
    `, removeEmptyTags);
});

router.get('/:account_id/margin/:month', (_, res) => res.pgOne(`
        select account_id, sum(cost) as cost
        from gcp_billing.usage_daily
        where account_id = $(account_id)
        and invoice_month = $(month)
        and sku_id = 'C108-90BA-00EB'
        group by account_id, sku_id
    `, res));

module.exports = router;