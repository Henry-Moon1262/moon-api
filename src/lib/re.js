const re = {
    INVOICE_MONTH: /^\d{4}[01]\d$/,
    BILLING_ACCOUNT_ID: /^([0-9A-F]{6}-){2}[0-9A-F]{6}$/,
};

module.exports = re;