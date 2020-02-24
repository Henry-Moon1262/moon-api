--------------------------------------------------
-- alter
--------------------------------------------------

-- exchange_type column to contract table
alter table gcp_billing.contract add "exchange_type" varchar(20) default 'send_rate';

-- drop exchange_type column to contract table

-- ALTER TABLE gcp_billing.contract DROP COLUMN exchange_type;

--------------------------------------------------
-- rollback
--------------------------------------------------

--------------------------------------------------
-- drop Contraint
--------------------------------------------------

ALTER TABLE gcp_billing.exchange_rate DROP CONSTRAINT exchange_rate_pk;

--------------------------------------------------
-- alter Contraint
--------------------------------------------------
ALTER TABLE gcp_billing.exchange_rate ADD CONSTRAINT exchange_rate_pk PRIMARY KEY ("month","date",code);

--------------------------------------------------
-- rollback
--------------------------------------------------

-- ALTER TABLE gcp_billing.exchange_rate ADD CONSTRAINT exchange_rate_pk PRIMARY KEY ("month",code);
