--------------------------------------------------
-- alter Contraint
--------------------------------------------------
ALTER TABLE gcp_billing.exchange_rate DROP CONSTRAINT exchange_rate_pk;

--------------------------------------------------
-- alter Contraint
--------------------------------------------------
ALTER TABLE gcp_billing.exchange_rate ADD CONSTRAINT exchange_rate_pk PRIMARY KEY ("date",code);