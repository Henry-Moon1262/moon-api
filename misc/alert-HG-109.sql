ALTER TABLE gcp_billing.project ADD "number" bigint NULL;

update gcp_billing.project
set number = cast(resource_name as bigint)
where id = id

ALTER TABLE gcp_billing.project DROP COLUMN resource_name;

-- DROP TABLE gcp_billing.promotion_credit;
CREATE TABLE gcp_billing.promotion_credit (
	account_id varchar(200) NOT NULL,
	"name" varchar(100) NOT NULL,
	created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL DEFAULT now(),
  expired_at timestamp NULL,
	start_time timestamp NOT NULL,
	incentive_id int4 NULL,
	campaign_id int4 NULL,
	original_amount numeric NOT NULL,
	remain_amount numeric NOT NULL,
	currency varchar(3) NOT NULL,
	recurring bool NOT NULL,
	scope_rules json[] NULL,
	CONSTRAINT credit_pk PRIMARY KEY (account_id, "name")
);

-- Permissions
ALTER TABLE gcp_billing.promotion_credit OWNER TO postgres;
GRANT ALL ON TABLE gcp_billing.promotion_credit TO postgres;

