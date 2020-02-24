const errors = require('@/lib/errors');
const pg = require('@/lib/pg');

// Collect to User Validations
function checkUserValidation(params) {
  if (params.name.length === 0) {
    errors.throw(errors.INVALID_PARAMETER, 'Name not found');
  }
  if (params.email.length === 0) {
    errors.throw(errors.INVALID_PARAMETER, 'Email not found');
  }
  if (params.type.length === 0) {
    errors.throw(errors.INVALID_PARAMETER, 'Invalid Type');
  }
}

async function checkInvoiceTemplate(param) {
  const contracts = await pg.any(`
    select
      name,
      "to",
       cc
    from gcp_billing.contract
  `);

  return contracts.reduce((arr, val) => {
    const toIdx = val.to !== null ? val.to.findIndex(t => t.seq === Number(param.seq)) : -1;
    const ccIdx = val.cc !== null ? val.cc.findIndex(t => t.seq === Number(param.seq)) : -1;
    if (toIdx > -1 || ccIdx > -1) {
      arr.push(val.name);
    }
    return arr;
  }, [])
}

// Collect to Contract Validations
function checkContractValidation(params) {
  if (params.name.length === 0) {
    errors.throw(errors.INVALID_PARAMETER, 'Name not found');
  }
  if (params.company.length === 0) {
    errors.throw(errors.INVALID_PARAMETER, 'Company not found');
  }
  if (params.discount_rate < 0.0 || params.discount_rate > 100.0) {
    errors.throw(errors.INVALID_PARAMETER, 'Invalid discount rate');
  }
  if (!(params.charge_currency === 'KRW' || params.charge_currency === 'USD')) {
    errors.throw(errors.INVALID_PARAMETER, `${params.charge_currency} not allowed currency`);
  }
  if (params.to.length === 0) {
    errors.throw(errors.INVALID_PARAMETER, 'Receivers not found');
  }
  if (params.accounts.length === 0) {
    errors.throw(errors.INVALID_PARAMETER, 'Accounts not found');
  }
}

module.exports = {
  checkUserValidation,
  checkContractValidation,
  checkInvoiceTemplate,
}