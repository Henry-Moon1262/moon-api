const router = require('express').Router();
const config = require('@/config');

if (config.apiCache && config.apiCache.enabled) {
    const jsonCache = require('@/middleware/json-cache');
    router.use(jsonCache(config.apiCache.options));
}

router.use('/user', require('./user'));
router.use('/group', require('./group'));

router.use('/account', require('./account'));
router.use('/project', require('./project'));
router.use('/service', require('./service'));
router.use('/sku', require('./sku'));

router.use('/usage_daily', require('./usage_daily'));
router.use('/usage_monthly', require('./usage_monthly'));

router.use('/aggregate', require('./aggregate'));
router.use('/invoice', require('./invoice'));
router.use('/original_invoice', require('./original_invoice'));

router.use('/user_setting', require('./user_setting'));
router.use('/exchange_rate', require('./exchange_rate'));

router.use('/email_template', require('./email_template'));
router.use('/email_delivery', require('./email_delivery'));
router.use('/contract', require('./contract'));

router.use('/setting', require('./setting'));

router.use('/gsuite_estimate', require('./gsuite_estimate'));
router.use('/gsuite_usage', require('./gsuite_usage'));
router.use('/gsuite_invoice', require('./gsuite_invoice'));

router.use('/promotion_credit', require('./promotion_credit'));
router.use('/alarm', require('./alarm'));

router.use('/account_migration', require('./account_migration'));

module.exports = router;