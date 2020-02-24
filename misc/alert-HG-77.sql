-- Drop table

-- DROP TABLE gcp_billing.gcp_sla_credit;

CREATE TABLE gcp_billing.gcp_sla_credit
(
	credit_memo_num varchar(100),
	project_id varchar(100) null,
	account_id varchar(100),
	invoice_month varchar(100),
	payment_id varchar(100),
	total_credit floor,
	resource_name varchar(100),
	"desc" varchar(1000),
	credit_include bool default false,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now()
);

-- Permissions

ALTER TABLE gcp_billing.csv_sla_credit OWNER TO postgres;
GRANT ALL ON TABLE gcp_billing.csv_sla_credit TO postgres;

--------------------------------------------------
-- alter
--------------------------------------------------
ALTER TABLE gcp_billing.project ADD resource_name varchar(100) null;

-- drop resource_name column to gcp_billing.project table