--------------------------------------------------
-- alter
--------------------------------------------------

-- "from" column to email_delivery table

ALTER TABLE gcp_billing.email_delivery ADD COLUMN "from" int default null;

-- drop "from" column to email_delivery table

-- ALTER TABLE gcp_billing.email_delivery DROP COLUMN "from";

--------------------------------------------------
-- rollback
--------------------------------------------------

