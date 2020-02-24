const router = require('express').Router();
const errors = require('@/lib/errors');

router.use(require('@/middleware/json-response')());
router.use(require('@/middleware/error-response')('noimpl', errors.NOT_IMPLEMENTED));
router.use(require('@/middleware/bq-response')());
router.use(require('@/middleware/pg-response')());
router.use(require('@/middleware/param-checker')());

router.use('/v1', require('./v1'));

router.use(require('@/middleware/error-handle')());

module.exports = router;