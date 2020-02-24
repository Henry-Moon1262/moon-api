const pg = require('@/lib/pg');
const errors = require('@/lib/errors');
const router = require('express').Router();
const { checkContractValidation } = require('@/lib/validations');

router.get('/', (_, res) => res.pg(`
    select
        seq,
        "name",
        company,
        accounts,
        discount_rate,
        remark,
        enabled,
        created_at,
        updated_at,
        deleted_at,
        email_template_seq,
        charge_currency,
        "to",
        cc,
        exchange_type,
        include_usage,
        include_project_id,
        comment
    from gcp_billing.contract
    where deleted_at is null
`));

router.get('/:seq(\\d+)', (_, res) => res.pgOne(`
    select
        seq,
        "name",
        company,
        accounts,
        discount_rate,
        remark,
        enabled,
        created_at,
        updated_at,
        deleted_at,
        email_template_seq,
        charge_currency,
        "to",
        cc,
        exchange_type,
        include_usage,
        include_project_id,
        comment
    from gcp_billing.contract
    where seq = $(seq)
`));

router.post('/', async (req, res) => {
    const params = req.body;
    checkContractValidation(params);
    await pg.none(`
        insert into gcp_billing.contract (
            name,
            company,
            accounts,
            discount_rate,
            remark,
            enabled,
            email_template_seq,
            charge_currency,
            "to",
            cc,
            exchange_type,
            include_usage,
            include_project_id,
            comment)
        values(
            $(name),
            $(company),
            $(accounts)::json[],
            $(discount_rate),
            $(remark),
            $(enabled),
            $(email_template_seq),
            $(charge_currency),
            $(to)::json[],
            $(cc)::json[],
            $(exchange_type),
            $(include_usage),
            $(include_project_id),
            $(comment))
    `, params);
    res.success({});
});

router.put('/:seq(\\d+)', async (req, res) => {
    const params = req.body;
    checkContractValidation(params);
    await pg.result(`
        update gcp_billing.contract
        set
            name = $(name),
            company = $(company),
            accounts = $(accounts):: json[],
            discount_rate = $(discount_rate),
            remark = $(remark),
            enabled = $(enabled),
            updated_at = now(),
            email_template_seq = $(email_template_seq),
            charge_currency = $(charge_currency),
            "to" = $(to):: json[],
            cc = $(cc):: json[],
            exchange_type = $(exchange_type),
            include_usage = $(include_usage),
            include_project_id = $(include_project_id),
            comment = $(comment)
        where seq = $(seq)
    `, params);
    res.success({});
});

router.delete('/:seq(\\d+)', (_, res) => res.pgResult(`
    delete from gcp_billing.contract
    where seq = $(seq)
`));

router.get('/credit/:invoice_month(\\d{6})', (_, res) => res.pg(`
    select
        i.seq,
        i.contract_seq,
        c.name,
        i.invoice_month,
        i.currency,
        i.credit,
        i."desc",
        i.included_discount,
        i.created_at,
        i.updated_at,
        i.deleted_at
    from gcp_billing.invoice_credit i
    inner join gcp_billing.contract c
    on i.contract_seq = c.seq
    where i.invoice_month = $(invoice_month)
    and i.deleted_at is null
`));

router.get('/credit/:contract_seq(\\d+)/:invoice_month(\\d{6})', (_, res) => res.pg(`
    select
        seq,
        contract_seq,
        invoice_month,
        currency,
        credit,
        "desc",
        included_discount,
        created_at,
        updated_at,
        deleted_at
    from gcp_billing.invoice_credit
    where contract_seq = $(contract_seq)
    and invoice_month = $(invoice_month)
    and deleted_at is null
`));

router.post('/credit', (_, res) => res.pgResult(`
    insert into gcp_billing.invoice_credit
            (contract_seq, invoice_month, credit, "desc", included_discount, currency)
    values($(contract_seq), $(invoice_month), $(credit), $(desc), $(included_discount), $(currency))
`));

router.put('/credit/:seq(\\d+)', (_, res) => res.pgResult(`
    update gcp_billing.invoice_credit
    set
        currency = $(currency),
        credit = $(credit),
        "desc" = $(desc),
        included_discount = $(included_discount),
        updated_at = now()
    where seq = $(seq)
`));

router.delete('/credit/:seq(\\d+)', (_, res) => res.pgResult(`
    update gcp_billing.invoice_credit
    set
        deleted_at = now()
    where seq = $(seq)
`));

module.exports = router;
