-- DROP TABLE gcp_billing.alarm;

CREATE TABLE gcp_billing.alarm (
	seq serial NOT NULL,
	user_seq int4 NOT NULL,
	"name" varchar(300) NOT NULL,
	account_id varchar(200) NOT NULL,
	"data" json NOT NULL,
	"type" varchar(50) NOT NULL,
	setting json NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	target json NULL,
	CONSTRAINT alarm_pk PRIMARY KEY (seq)
);

UPDATE gcp_billing.email_template
SET "name"='프로모션 크레딧 경고', remark='알람', title='[메가존] 프로모션 크레딧 사용량 알림', html='<p><span style="color: rgb(34, 34, 34);">안녕하세요 </span><span style="color: rgb(38, 50, 56);">{{meta.recipient.name}}님, </span></p><p><strong>귀하의 빌링 계정 "{{alarm.account.name}}"은 등록한 </strong><strong style="color: rgb(34, 34, 34);">프로모션 크레딧의 {{alarm.setting}} 이상 사용하였습니다.</strong></p><p><strong style="color: rgb(34, 34, 34);">전체 크레딧: </strong><span style="color: rgb(34, 34, 34);">{{alarm.data.targetAmount}}</span></p><p><strong style="color: rgb(34, 34, 34);">사용 크레딧: </strong><span style="color: rgb(34, 34, 34);">{{alarm.data.usageAmount}}</span></p><p><br></p><p><strong>알람명</strong></p><p>{{alarm.name}}</p><p><strong>빌링 계정 ID</strong></p><p>{{alarm.account.id}}</p><p><strong>프로모션 크레딧명</strong></p><p><span style="color: rgb(34, 34, 34);">{{alarm.data.name}}</span></p><p><br></p><p><span style="color: rgb(34, 34, 34);">감사합니다.</span></p>', sample_data='{"alarm":{"name":"alarm-name1","account":{"name":"account-name1","id":"account-id1"},"setting":"50%","data":{"name":"promotion-credit1","targetAmount":"$120","usageAmount":"$70"}}}', created_at='2019-11-29 17:27:52.819', updated_at='2019-12-03 05:53:36.953', attachments='{}'
WHERE seq=15;

INSERT INTO gcp_billing.email_template
(seq, "name", remark, title, html, sample_data, created_at, updated_at, attachments)
VALUES(17, '예산 경고', '알람', '[메가존] 예산 {{alarm.setting}} 이상 사용', '<p>안녕하세요. <span style="color: rgb(38, 50, 56);">{{meta.recipient.name}}</span>님</p><p><strong>귀하의 빌링 계정 "{{alarm.account.name}}"은 등록한 예산 {{alarm.data.targetAmount}}의&nbsp;{{alarm.setting}} 이상 사용하였습니다.</strong></p><p><br></p><p><strong>예산 이름</strong></p><p>{{alarm.name}}</p><p><strong>빌링 계정 ID</strong></p><p>{{alarm.account.id}}</p><p><strong>선택한 프로젝트</strong></p><p>{{alarm.data.name}}</p><p><br></p><p>감사합니다.</p>', '{"alarm":{"name":"alarm-name1","setting":"50%","data":{"name":"project-name1, project-name2","targetAmount":"$120"},"account":{"id":"account-id1","name":"account-name1"}}}', now(), now(), NULL);

INSERT INTO gcp_billing.setting
(seq, "data", created_at)
VALUES(12, '{"invoiceEmail":11,"smtpSender":"메가존 <gct@mz.co.kr>","alarmEmail":15,"alarmSender":"메가존 <gct@mz.co.kr>","budgetAlarmEmail":17,"budgetAlarmSender":"메가존 <gct@mz.co.kr>","gsuiteEstimateEmail":14,"gsuiteEstimateSender":"메가존 <gct@mz.co.kr>"}', now());
