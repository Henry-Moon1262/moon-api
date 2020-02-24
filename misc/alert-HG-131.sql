--------------------------------------------------
-- alter
--------------------------------------------------

-- add comment column to contract table
alter table gcp_billing.contract add "comment" varchar(1000) null;


-- drop comment column to contract table

-- alter table gcp_billing.contract drop column "comment";


--------------------------------------------------
-- rollback
--------------------------------------------------

