module.exports = {
    server: {
        port: 3000,
    },
    appSettings: {
        'x-powered-by': false,
        etag: false,
    },
    gcp: {
        projectId: 'moon-api-269204',
    },
    apiCache: {
        enabled: false,
        options: {
            cache: {
                stdTTL: 30 * 60,
            },
        },
    },

    pg: {
        user: process.env.PG_USER || 'postgres',
        host: process.env.PG_HOST || 'localhost',
        database: process.env.PG_DATABASE || 'postgres',
        password: process.env.PG_PASSWORD || 'postgres',
        port: Number(process.env.PG_PORT) || 5432,
    },
};
