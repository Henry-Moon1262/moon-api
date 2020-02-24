-- DROP TABLE gcp_billing.gsuite_usage;
CREATE TABLE gcp_billing.gsuite_usage (
	seq bigserial NOT NULL,
	invoice_month varchar(6) NOT NULL,
	account_id varchar(200) NOT NULL,
	sku_id varchar(50) NOT NULL,
	"desc" varchar(20) NOT NULL,
	order_name varchar(30) NULL,
	start_date timestamp NOT NULL,
	end_date timestamp NOT NULL,
	count int4 NOT NULL,
	"cost" numeric NOT NULL,
	currency varchar(3) NOT NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT gsuite_usage_pk PRIMARY KEY (seq)
);
CREATE INDEX gsuite_usage_invoice_month_idx ON gcp_billing.gsuite_usage USING btree (invoice_month,account_id);

-- Permissions

ALTER TABLE gcp_billing.gsuite_usage OWNER TO postgres;
GRANT ALL ON TABLE gcp_billing.gsuite_usage TO postgres;


-- DROP TABLE gcp_billing.gsuite_invoice;
CREATE TABLE gcp_billing.gsuite_invoice (
	seq bigserial NOT NULL,
	invoice_month varchar(6) NOT NULL,
	contract_seq int4 NOT NULL,
	"cost" numeric NOT NULL,
	exchange_rate numeric NOT NULL,
	vat numeric NOT NULL,
	final_cost numeric NOT NULL,
	usage_data json NOT NULL,
	status varchar(10) NOT NULL DEFAULT 'created',
	created_at timestamp NOT NULL DEFAULT now(),
	deleted_at timestamp NULL,
	CONSTRAINT gsuite_invoice_pk PRIMARY KEY (seq)
);
CREATE INDEX gsuite_invoice_invoice_month_idx ON gcp_billing.gsuite_invoice (invoice_month,status);

-- Permissions

ALTER TABLE gcp_billing.gsuite_invoice OWNER TO postgres;
GRANT ALL ON TABLE gcp_billing.gsuite_invoice TO postgres;

ALTER TABLE gcp_billing.contract ADD "type" varchar(10) NOT NULL DEFAULT 'gcp';
CREATE INDEX contract_type_idx ON gcp_billing.contract ("type");

ALTER TABLE gcp_billing.account ADD "type" varchar(10) NOT NULL DEFAULT 'gcp';
CREATE INDEX account_type_idx ON gcp_billing.account ("type");

ALTER TABLE gcp_billing.account ALTER COLUMN id TYPE varchar(200) USING id::varchar;
ALTER TABLE gcp_billing.group_account ALTER COLUMN account_id TYPE varchar(200) USING account_id::varchar;

