const fs = require('fs');
const path = require('path');

function watchFile(filename, options, cb) {
    if (typeof options == 'function') {
        cb = options;
        options = {};
    } else {
        options = options || {};
    }

    const pathToWatch = path.resolve(process.cwd(), filename);

    if (!fs.existsSync(pathToWatch)) {
        return;
    }

    fs.watch(pathToWatch, (eventType, filename) => {
        if (options.oneTime) {
            fs.unwatchFile(pathToWatch);
        }

        cb(eventType, filename);
    });
}

function unwatchFile(filename) {
    const pathToWatch = path.resolve(process.cwd(), filename);

    fs.unwatchFile(pathToWatch);
}

module.exports = {
    watchFile,
    unwatchFile,
};