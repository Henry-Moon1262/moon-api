--------------------------------------------------
-- alter
--------------------------------------------------

ALTER TABLE gcp_billing.exchange_rate ADD initial_notice bool NOT NULL DEFAULT false;
ALTER TABLE gcp_billing.exchange_rate ALTER COLUMN initial_notice SET DEFAULT true;

--------------------------------------------------
-- rollback
--------------------------------------------------

