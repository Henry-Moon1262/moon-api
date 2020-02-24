const router = require('express').Router();
const pg = require('@/lib/pg');

router.get('/', (_, res) => res.pg(`
    select
        i.seq,
        contract_seq,
        c.name,
        c.company,
        invoice_month,
        currency,
        original_costs,
        original_cost,
        discount,
        cost,
        exchange_rate,
        vat,
        final_cost,
        status,
        merged_seqs,
        i.created_at,
        i.updated_at,
        i.deleted_at,
        c.charge_currency
    from gcp_billing.invoice i
    join gcp_billing.contract c on i.contract_seq = c.seq
    where i.deleted_at is null
        @{{ and invoice_month = $(invoice_month) }}
        @{{ and invoice_month < $(compared_month) }}
        @{{ and contract_seq = $(contract_seq) }}
        @{{ and status = $(status) }}
`));

router.get('/:seq(\\d+)', (_, res) => res.pgOne(`
    select
        i.seq,
        contract_seq,
        c.name,
        c.company,
        invoice_month,
        currency,
        original_costs,
        original_cost,
        discount,
        cost,
        exchange_rate,
        vat,
        final_cost,
        status,
        usage_data,
        merged_seqs,
        i.created_at,
        i.updated_at,
        i.deleted_at
    from gcp_billing.invoice i
    join gcp_billing.contract c on i.contract_seq = c.seq
    where i.seq = $(seq)
`));

router.patch('/:seq(\\d+)', (_, res) => res.pgOne(`
    update gcp_billing.invoice
    set
        @{{ status = $(status), }}
        @{{ deleted_at = $(deleted_at), }}
        updated_at = now()
    where seq = $(seq)
`));

router.patch('/updateStatus', async (req, res) => {
    const params = req.body;
    const errors = [];

    for (const seq of params.seqs) {
        await pg.tx(async t => {
            const invoice = await t.one(`
                select
                    seq,
                    contract_seq,
                    invoice_month,
                    status,
                    merged_seqs
                from gcp_billing.invoice
                where seq = ${seq}
                for update
            `);

            if (invoice.status !== params.status) {
                //유예 후 확정한 인보이스 여부 확인
                const confirmed = await t.result(`
                    select seq
                    from (
                        select i.seq, elem::text::int
                        from gcp_billing.invoice i, json_array_elements(merged_seqs->'seqs') elem
                        where contract_seq = ${invoice.contract_seq}
                        and invoice_month > '${invoice.invoice_month}'
                        and status = 'confirmed'
                        and deleted_at is null
                    ) u
                    where u.elem = ${seq}
                `);
                if (confirmed.rowCount > 0) {
                    errors.push({ seq, msg: 'findDeferredMsg' });
                    throw `find invoice applied with deferment: seq(${seq})`;
                }
                //유예 인보이스를 포함하고 있는 경우
                //Confirmed 인 경우 유예 인보이스가 존재하는지 상태는 deferred 확인
                //그 이외 상태인경우 유예 인보이스들읨 상태를 deferred로 변경
                for (const mergedSeq of invoice.merged_seqs.seqs) {
                    if (params.status === 'confirmed') {
                        const result = await t.result(`
                            update gcp_billing.invoice
                            set status = '${params.status}'
                            where seq = ${mergedSeq} and status = 'deferred'
                        `);
                        if (result.rowCount !== 1) {
                            errors.push({ seq: mergedSeq, msg: 'cancelInvoiceMsg' });
                            throw `merged invoice not found: seq(${mergedSeq})`;
                        }
                    } else {
                        const result = await t.result(`
                            update gcp_billing.invoice
                            set status = 'deferred'
                            where seq = ${mergedSeq}
                        `);
                        if (result.rowCount !== 1) {
                            errors.push({ seq: mergedSeq, msg: 'cancelInvoiceMsg' });
                            throw `merged invoice not found: seq(${mergedSeq})`;
                        }
                    }
                }
                await t.none(`update gcp_billing.invoice set status = '${params.status}' where seq = ${seq}`);
            }
        })
            .catch(e => {
                console.log(e);
            });

    }
    return res.success({ errors });
});

module.exports = router;