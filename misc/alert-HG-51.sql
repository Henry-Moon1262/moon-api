--------------------------------------------------
-- alter
--------------------------------------------------

-- merged_seqs column to invoice table
ALTER TABLE gcp_billing.invoice ADD merged_seqs json default to_json('{"seqs":[]}'
::json);

-- drop merged_seqs column to invoice table

-- ALTER TABLE gcp_billing.invoice DROP COLUMN merged_seqs;

--------------------------------------------------
-- rollback
--------------------------------------------------

