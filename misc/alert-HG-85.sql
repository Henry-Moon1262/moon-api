-- DROP TABLE gcp_billing.gsuite_estimate;
CREATE TABLE gcp_billing.gsuite_estimate (
	seq bigserial NOT NULL,
	month varchar(6) NOT NULL,
	sub_id varchar(20) NOT NULL,
	sku_id varchar(50) NOT NULL,
	account_id varchar(20) NOT NULL,
	plan_name varchar(20) NOT NULL,
	plan_end_time timestamp NOT NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	sent_at timestamp NULL,
	CONSTRAINT gsuite_estimate_pk PRIMARY KEY (seq)
);
CREATE INDEX gsuite_estimate_month_idx ON gcp_billing.gsuite_estimate USING btree (month);

-- Permissions

ALTER TABLE gcp_billing.gsuite_estimate OWNER TO postgres;
GRANT ALL ON TABLE gcp_billing.gsuite_estimate TO postgres;

-- DROP TABLE gcp_billing.gsuite_sku;
CREATE TABLE gcp_billing.gsuite_sku (
	id varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	price numeric NOT NULL DEFAULT 0,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT gsuite_sku_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE gcp_billing.gsuite_sku OWNER TO postgres;
GRANT ALL ON TABLE gcp_billing.gsuite_sku TO postgres;

-- DROP TABLE gcp_billing.gsuite_sub;
CREATE TABLE gcp_billing.gsuite_sub (
	id varchar(20) NOT NULL,
	sku_id varchar(50) NOT NULL,
	account_id varchar(20) NOT NULL,
	creation_time timestamp NOT NULL,
	status varchar(10) NOT NULL,
	plan json NOT NULL,
	plan_name varchar(20) NOT NULL,
	plan_end_time timestamp NULL,
	seats json NOT NULL,
	renewal_settings json NULL,
	trial_settings json NOT NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT subscription_pk PRIMARY KEY (id)
);
CREATE INDEX gsuite_sub_plan_name_idx ON gcp_billing.gsuite_sub (plan_name,status,plan_end_time);

-- Permissions
ALTER TABLE gcp_billing.gsuite_sub OWNER TO postgres;
GRANT ALL ON TABLE gcp_billing.gsuite_sub TO postgres;

