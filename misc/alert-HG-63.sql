-- project
ALTER TABLE gcp_billing.project DROP CONSTRAINT project_pk;
ALTER TABLE gcp_billing.project ADD CONSTRAINT project_pk PRIMARY KEY (id, account_id);

-- usage_daily
TRUNCATE TABLE gcp_billing.usage_daily;
TRUNCATE TABLE gcp_billing.usage_monthly;
TRUNCATE TABLE gcp_billing.credit_daily;
TRUNCATE TABLE gcp_billing.credit_monthly;

ALTER TABLE gcp_billing.usage_daily ADD currency varchar(3) NOT NULL DEFAULT 'USD';
ALTER TABLE gcp_billing.usage_daily DROP CONSTRAINT usage_daily_pk;
ALTER TABLE gcp_billing.usage_daily ADD CONSTRAINT usage_daily_pk PRIMARY KEY (account_id, project_id, service_id, sku_id, invoice_month, location, country, region, zone, cost_type, usage_unit, usage_date, currency, t_system_machine_spec, t_system_cores, t_system_memory, t_user_owner, t_user_project, t_user_server, t_user_status, t_user_user, t_user_application, t_user_name, t_user_service, t_user_environment, t_user_phase, t_user_role, t_user_revision, t_user_team);

ALTER TABLE gcp_billing.usage_monthly ADD currency varchar(3) NOT NULL DEFAULT 'USD';
ALTER TABLE gcp_billing.usage_monthly DROP CONSTRAINT usage_monthly_pk;
ALTER TABLE gcp_billing.usage_monthly ADD CONSTRAINT usage_monthly_pk PRIMARY KEY (account_id, project_id, service_id, sku_id, invoice_month, location, country, region, zone, cost_type, usage_unit, currency, t_system_machine_spec, t_system_cores, t_system_memory, t_user_owner, t_user_project, t_user_server, t_user_status, t_user_user, t_user_application, t_user_name, t_user_service, t_user_environment, t_user_phase, t_user_role, t_user_revision, t_user_team)

ALTER TABLE gcp_billing.credit_daily ADD currency varchar(3) NOT NULL DEFAULT 'USD';
ALTER TABLE gcp_billing.credit_daily DROP CONSTRAINT credit_daily_pk;
ALTER TABLE gcp_billing.credit_daily ADD CONSTRAINT credit_daily_pk PRIMARY KEY (account_id, project_id, service_id, sku_id, invoice_month, usage_date, credit_name, currency);

ALTER TABLE gcp_billing.credit_monthly ADD currency varchar(3) NOT NULL DEFAULT 'USD';
ALTER TABLE gcp_billing.credit_monthly DROP CONSTRAINT credit_monthly_pk;
ALTER TABLE gcp_billing.credit_monthly ADD CONSTRAINT credit_monthly_pk PRIMARY KEY (account_id, project_id, service_id, sku_id, invoice_month, credit_name, currency);
