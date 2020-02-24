require('module-alias/register');
require('dotenv').config();

const express = require('express');
require('express-async-errors');

const bodyParser = require('body-parser');

const config = require('@/config');

if (config.exitOnEnvChange) {
    const utils = require('@/lib/utils');

    utils.watchFile('.env', () => {
        process.exit();
    });
}

let app = express();

Object.entries(config.appSettings).forEach(([k, v]) => app.set(k, v));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use('/api', require('./api'));

var server = app.listen(config.server.port, () => {
    console.log("app running on port.", server.address().port);
});


// handle CTRL+C
process.on('SIGINT', () => {
    process.exit();
});