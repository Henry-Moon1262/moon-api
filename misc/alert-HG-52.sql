--------------------------------------------------
-- alter
--------------------------------------------------

-- add email_template_seq column to contract table
alter table gcp_billing.contract add column "email_template_seq" int4 default 0;

-- add email_template_seq column comment to contract table
-- COMMENT ON COLUMN gcp_billing.contract.email_template_seq IS 'default0(setting에 설정된 template사용)그외 번호는 email템플릿의 seq의 번호';

-- drop email_template_seq column to contract table
--  alter table gcp_billing.contract drop column "email_template_seq";


--------------------------------------------------
-- rollback
--------------------------------------------------

