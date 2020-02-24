const errors = {
    UNKNOWN: 'UNKNOWN',
    NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
    PARAMETER_MISSING: 'PARAMETER_MISSING',
    INVALID_PARAMETER: 'INVALID_PARAMETER',
    NOT_PROCESS_DELETE: 'NOT_PROCESS_DELETE',
    CANNOT_DELETE: 'CANNOT_DELETE',

    throw: (code, message) => {
        throw {
            code,
            message
        };
    },
};

module.exports = errors;