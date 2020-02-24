const errors = require('@/lib/errors');

function middleware() {
    return function (req, _, next) {
        let _params;

        req.getParams = () => {
            if (!_params)
                _params = Object.assign({}, req.params, req.query, req.body);

            return _params;
        };

        req.validateParam = (name, regexp, isRequired = false) => {
            const params = req.getParams();

            if (params[name] !== undefined) {
                if (!regexp.test(params[name])) {
                    errors.throw(errors.INVALID_PARAMETER, name);
                }
            } else if (isRequired) {
                errors.throw(errors.PARAMETER_MISSING, name);
            }
        };

        req.getParam = (name, validator, defaultValue) => {
            const params = req.getParams();
            let defValue = defaultValue;

            if (validator instanceof RegExp) {
                if (params[name] !== undefined && !validator.test(params[name])) {
                    return errors.throw(errors.INVALID_PARAMETER, name);
                }
            } else {
                defValue = validator;
            }

            if (defValue !== undefined) {
                return params[name] !== undefined ? params[name] : defValue;
            }

            if (params[name] === undefined) {
                return errors.throw(errors.PARAMETER_MISSING, name);
            }

            return params[name];
        };

        next && next();
    }
}

module.exports = middleware;