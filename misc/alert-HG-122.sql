--------------------------------------------------
-- alter
--------------------------------------------------

-- projects column to gcp_billing."aggregate"
ALTER TABLE gcp_billing."aggregate" ADD projects json NULL;

-- drop projects column to gcp_billing."aggregate"

-- ALTER TABLE gcp_billing."aggregate" DROP COLUMN projects;

-- ADD Projects Data to gcp_billing."aggregate".projects

/*
update gcp_billing."aggregate" 
set
	projects = (
				select
					T1.projects
				from
				(select
					st2.kind,
					st2.account_id,
					st2.invoice_month as "month",
			        json_agg(json_build_object('project', st2.project_id, 'data', st2.project_data))as projects
				from	
				 	(select
						st1.account_id,
						st1.invoice_month,
						st1.project_id,
						st1.kind,
						st1.from,
						st1.to,
						json_build_object(
						'kind',st1.kind,
						'from',st1.from,
						'to',st1.to,
						'usage', sum(st1.usage),
						'cost', round(cast(sum(st1.cost) as numeric), 6)
						)as project_data,
						sum(st1.usage) usage,
			            round(cast(sum(st1.cost) as numeric), 6) "cost"
					from
						(select
			                account_id,
			                invoice_month,
			                project_id,
			                (regexp_matches(s.name, '^Network (.*) from (.*) to (.*)'))[1] kind,
			                (regexp_matches(s.name, '^Network (.*) from (.*) to (.*)'))[2] "from",
			                (regexp_matches(s.name, '^Network (.*) from (.*) to (.*)'))[3] "to",
			                usage,
			                "cost"
			            from gcp_billing.usage_monthly u
			            join gcp_billing.sku s on s.id = u.sku_id
			            where service_id = (select id from gcp_billing.service where name = 'Compute Engine')
			                and usage > 0
			                )st1
			           group by st1.account_id, st1.invoice_month, st1.project_id,st1.kind,st1.from,st1.to
			           )st2
			        group by st2.account_id, st2.invoice_month, st2.kind
			        )T1
			        where gcp_billing."aggregate".account_id = T1.account_id
			        	and gcp_billing."aggregate".month = T1.month
			        	and gcp_billing."aggregate".kind = T1.kind
           		)
where "type" = 'data_transfer';
*/

--------------------------------------------------
-- rollback
--------------------------------------------------

