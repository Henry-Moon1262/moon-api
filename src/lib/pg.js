const pgp = require('pg-promise')();
const moment = require('moment');
const config = require('@/config');
const errors = require('@/lib/errors');
const debug = require('debug')('lib:pg');

pgp.pg.types.setTypeParser(1114, str => moment.utc(str).format());

const db = pgp(config.pg);

function end() {
    return db.$pool.end();
}

function values(rows, names) {
    return {
        params: [].concat(...rows.map(row => names.map(name => row[name]))),
        query: rows.map((_, i) => ('(' + names.map((_, j) => (`$${i * names.length + j + 1}`)).join(',') + ')')).join(','),
        columns: names.join(','),
    };
}

function conditional(query, params) {
    if (query.indexOf('@{{') === -1) {
        return query;
    }

    const regPatch = /@{{(.+)}}/g;

    return query.replace(regPatch, (_, q) => {
        const regParam = /[\$#]\(([^)]+)\)/g;
        let match;

        while ((match = regParam.exec(q)) !== null) {
            if (params[match[1]] === undefined) {
                return '';
            }
        }

        return q.trim();
    });
}

function bindInline(query, params) {
    if (query.indexOf('#(') === -1) {
        return query;
    }

    return query.replace(/#\((.+)\)/g, (_, q) => params[q]);
}

function pagination(query, params) {
    if (params['offset']) {
        if (!params['offset'].match(/^\d+$/)) {
            return errors.throw(errors.INVALID_PARAMETER, 'offset: ' + params['offset']);
        }
        query += `\noffset ${params['offset']}`;
    }

    if (params['limit']) {
        if (!params['limit'].match(/^\d+$/)) {
            return errors.throw(errors.INVALID_PARAMETER, 'limit: ' + params['limit']);
        }
        query += `\nlimit ${params['limit']}`;
    }

    return query;
}

function ordering(query, params, fields) {
    if (!params['order']) {
        return query;
    }

    const orders = params['order'].split(',');
    let isSet = false;

    orders.forEach(order => {
        const t = order.split(' ');
        if (fields.indexOf(t[0]) === -1) {
            return errors.throw(errors.INVALID_PARAMETER, 'order: ' + params['order']);
        }

        if (!isSet) {
            query += '\norder by ';
            isSet = true;
        } else {
            query += ', ';
        }

        query += t[0] + (t.length > 1 ? (t[1].toLowerCase() === 'desc' ? ' desc' : ' asc') : '')
    });

    return query;
}

function wrap(name) {
    return function (query, params, options) {
        options = options || {};

        if (params) {
            query = conditional(query, params);
            query = bindInline(query, params);

            if (options.orders) {
                query = ordering(query, params, options.orders);
            }

            if (options.pagination) {
                query = pagination(query, params);
            }
        }

        debug('query', '[', query, ']');
        debug('params', params);
        debug('options', options);

        return db[name].call(db, query, params);
    };
}

const MAX_PARAMETERS = 100000; // 현재 postgres 쿼리 파라미더 개수 최대값

function batchSize(rowCount, columnCount, reservedParameterCount) {
    const reservedCount = reservedParameterCount || 100; // 나머지 파라미터들을 위해 남겨둘 개수
    const size = Math.floor((MAX_PARAMETERS - reservedCount) / columnCount);
    return {
        batchSize: size,
        batchCount: Math.floor((rowCount + size - 1) / size),
    };
}

module.exports = {
    db,
    end,
    values,
    conditional,
    bindInline,
    result: wrap('result'),
    any: wrap('any'),
    none: wrap('none'),
    one: wrap('one'),
    oneOrNone: wrap('oneOrNone'),
    many: wrap('many'),
    tx: db.tx.bind(db),
    batchSize,
    MAX_PARAMETERS,
};