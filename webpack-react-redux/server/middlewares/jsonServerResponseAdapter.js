const chalk = require('chalk');

module.exports = function jsonServerResponseAdapter(rules) {
    return function (req, res, next) {
        let skip = true;

        for (let i = 0, len = rules.length; i < len; i++) {
            if (rules[i].regex.test(req.originalUrl)) {
                skip = false;

                let finalResponse = {};

                if (rules[i].responseDecorate !== undefined
                    && rules[i].responseDecorate.length > 0
                   ) {
                    rules[i].responseDecorate.forEach(decorate => {
                        finalResponse = decorate(res, finalResponse);
                    });
                }

                res.jsonp(finalResponse);

                console.log(JSON.stringify({
                    middleware: 'jsonServerResponseAdapter',
                    regex: rules[i].regex.toString(),
                    'req.originalUrl': req.originalUrl,
                }));
                console.log(chalk.blue('Paste cookie in case proxy backend:'));

                break;
            }
        }

        if (skip) {
            res.jsonp(res.locals.data);
        }
    };
};
