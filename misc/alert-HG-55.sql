-- Drop table

-- DROP TABLE gcp_billing.invoice_credit;

CREATE TABLE gcp_billing.invoice_credit (
	seq bigserial NOT NULL,
	contract_seq int4 NOT NULL,
	invoice_month varchar(6) NOT NULL,
	credit float8 NOT NULL,
    "desc" varchar(100) NOT NULL,
	included_discount bool NOT NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	deleted_at timestamp NULL,
	CONSTRAINT invoice_credit_pk PRIMARY KEY (seq)
);

-- Permissions

ALTER TABLE gcp_billing.invoice_credit OWNER TO postgres;
GRANT ALL ON TABLE gcp_billing.invoice_credit TO postgres;
