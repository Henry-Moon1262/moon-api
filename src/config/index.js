module.exports = require('load-config-js')(
    __dirname,
    'default',
    `${process.env.SERVICE_ENV || process.env.NODE_ENV || 'development'}`,
    'local',
);