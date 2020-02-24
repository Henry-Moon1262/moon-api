const router = require('express').Router();

router.get('/:account_id/:month', (_, res) => res.pg(`
    select
        u.account_id,
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
        currency,
        t_system_machine_spec,
        t_system_cores,
        t_system_memory,
        t_user_owner,
        t_user_project,
        t_user_server,
        t_user_status,
        t_user_user,
        t_user_application,
        t_user_name,
        t_user_service,
        t_user_environment,
        t_user_phase,
        t_user_role,
        t_user_revision,
        t_user_team,
        usage,
        cost,
        credit,
        usage_start_date,
        usage_end_date,
        cost_in_usd,
        credit_in_usd
    from gcp_billing.usage_monthly u
    left join gcp_billing.project p on p.id = u.project_id and p.account_id = u.account_id
    left join gcp_billing.service s on s.id = u.service_id
    left join gcp_billing.sku k on k.id = u.sku_id
    left join gcp_billing.country c on c.id = u.country
    where u.account_id = $(account_id)
        and u.invoice_month = $(month)
`));

router.get('/:account_id', (_, res) => res.pg(`
    select
        u.account_id,
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
        t_system_machine_spec,
        t_system_cores,
        t_system_memory,
        t_user_owner,
        t_user_project,
        t_user_server,
        t_user_status,
        t_user_user,
        t_user_application,
        t_user_name,
        t_user_service,
        t_user_environment,
        t_user_phase,
        t_user_role,
        t_user_revision,
        t_user_team,
        usage,
        cost,
        credit,
        usage_start_date,
        usage_end_date,
        cost_in_usd,
        credit_in_usd
    from gcp_billing.usage_monthly u
    left join gcp_billing.project p on p.id = u.project_id and p.account_id = u.account_id
    left join gcp_billing.service s on s.id = u.service_id
    left join gcp_billing.sku k on k.id = u.sku_id
    left join gcp_billing.country c on c.id = u.country
    where u.account_id = $(account_id)
`));

module.exports = router;