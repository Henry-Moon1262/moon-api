const pg = require('@/lib/pg');
const router = require('express').Router();
const moment = require('moment');

const getColumns = `
        "month",
        to_char(date, 'YYYY-MM-DD') date,
        country,
        code,
        buy_rate,
        buy_spread,
        sell_rate,
        sell_spread,
        send_rate,
        receive_rate,
        buy_check_rate,
        sell_check_rate,
        basic_rate,
        commission_rate,
        usd_rate,
        created_at,
        updated_at,
        initial_notice
`;

router.get('/', (_, res) => res.pg(`
    select
        ${getColumns}
    from gcp_billing.exchange_rate
`));

router.get('/all/:date', async (req, res) => {
    const param = req.params
    console.log(typeof date);
    let subDays = 1;

    let isEmpty = true
    let exchageData = [];

    while (isEmpty) {
        exchageData = await pg.any(`
            select
                ${getColumns}
            from gcp_billing.exchange_rate
            where date = $(date)
            `, param);

        if (exchageData.length > 0) {
            isEmpty = false;
        }

        param.date = moment(param.date, 'YYYY-MM-DD').subtract(subDays, 'days').format('YYYY-MM-DD');

        subDays += 1;
    };
    res.success(exchageData);
});


module.exports = router;