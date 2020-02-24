--------------------------------------------------
-- alter
--------------------------------------------------

ALTER TABLE gcp_billing.contract ADD charge_currency varchar(3) NOT NULL DEFAULT 'KRW'::character varying;