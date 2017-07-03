const path = require('path');
const chalk = require('chalk');

module.exports = function staticJsonResponse(rootPath) {
    return function (regexes) {
        return function (req, res, next) {
            let skip = true;

            for (let i = 0, len = regexes.length; i < len; i++) {
                if (regexes[i].test(req.url)) {
                    skip = false;

                    const filepath = path.resolve(
                        path.join(
                            rootPath,
                            req.baseUrl,
                            req.path,
                            req.method + '.json'
                        )
                    );

                    res.setHeader('Cache-Control', 'no-cache');
                    res.sendFile(filepath);

                    console.log(JSON.stringify({
                        middleware: 'staticJsonResponse',
                        regex: regexes[i].toString(),
                        'req.url': req.url,
                        filepath: filepath,
                    }));
                    console.log(chalk.blue('Paste cookie in case proxy backend:'));

                    break;
                }
            }

            if (skip) {
                next();
            }
        };
    };
};
