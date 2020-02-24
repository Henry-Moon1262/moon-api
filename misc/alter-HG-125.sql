-- Drop table

-- DROP TABLE gcp_billing.alarm;

CREATE TABLE gcp_billing.alarm (
	seq serial NOT NULL,
	user_seq int4 NOT NULL,
	remark varchar(1000) NULL,
	account_id varchar(200) NOT NULL,
	"data" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	setting json NULL,
	original_amount numeric NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT alarm_pk PRIMARY KEY (seq)
);

INSERT INTO gcp_billing.email_template
("name", remark, title, html, sample_data, created_at, updated_at, attachments)
VALUES('프로모션 크레딧', '테스트', '[메가존] 프로모션 크레딧 사용량 알림', '<p><span style="color: rgb(34, 34, 34);">안녕하세요 </span><span style="color: rgb(38, 50, 56);">{{meta.recipient.name}}님, </span></p><p><br></p><p><span style="color: rgb(34, 34, 34);">프로모션 크레딧({{alarm.promotionCredit.name}})을 {{alarm.setting}} 이하로 남았습니다.</span></p><p><span style="color: rgb(34, 34, 34);">전체 크레딧: $ {{alarm.promotionCredit.originalAmount}}</span></p><p><span style="color: rgb(34, 34, 34);">남은 크레딧: $ {{alarm.promotionCredit.remainAmount}}</span></p><p><br></p><p><span style="color: rgb(34, 34, 34);">감사합니다.</span></p>', '{"alarm":{"setting":"90","promotionCredit":{"name":"프로모션 크레딧 이름","originalAmount":"1000000","remainAmount":"800000"}}}', '2019-10-14 04:41:06.136', '2019-10-15 06:16:27.218', '{}');

insert into gcp_billing.setting (data) values ('{"invoiceEmail":11,"smtpSender":"메가존 <gct@mz.co.kr>","alarmEmail":15,"alarmSender":"메가존 <gct@mz.co.kr>"}');

ALTER TABLE gcp_billing.email_delivery ADD "to" json[] NULL;
ALTER TABLE gcp_billing.email_delivery ADD "cc" json[] NULL;

update gcp_billing.email_delivery as d
set "to" =  e.recipients
from (select
seq,
(
    select array_agg(json_build_object('seq', seq, 'email', email, 'name', name))
    from gcp_billing.user
    where seq = any(recipients)
) recipients
from gcp_billing.email_delivery ) as e
where d.seq = e.seq

ALTER TABLE gcp_billing.email_delivery ALTER COLUMN recipients DROP NOT NULL;

ALTER TABLE gcp_billing.contract ADD "to" json[] NULL;
ALTER TABLE gcp_billing.contract ADD "cc" json[] NULL;

update gcp_billing.contract as d
set "to" =  e.receivers
from (select
seq,
(
    select array_agg(json_build_object('seq', seq, 'email', email, 'name', name))
    from gcp_billing.user
    where seq = any(receivers)
) receivers
from gcp_billing.contract ) as e
where d.seq = e.seq

ALTER TABLE gcp_billing.contract ALTER COLUMN receivers DROP NOT NULL;


-- DROP TABLE gcp_billing.credit;
CREATE TABLE gcp_billing.credit (
	id varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT credit_pk PRIMARY KEY (id)
);

DROP TABLE gcp_billing.promotion_credit;
CREATE TABLE gcp_billing.promotion_credit (
	account_id varchar(200) NOT NULL,
	credit_id varchar(100) NOT NULL,
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
	CONSTRAINT promotion_credit_pk PRIMARY KEY (account_id, credit_id)
);

ALTER TABLE gcp_billing.alarm RENAME COLUMN "data" TO credit_id;
