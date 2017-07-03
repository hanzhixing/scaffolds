const chalk = require('chalk');

module.exports = function backendProxyMiddleware(proxy) {
    proxy.on('proxyReq', (proxyReq, req, res, options) => {
        console.log(JSON.stringify({
            middleware: 'backendProxyMiddleware',
            event: 'proxyReq',
            headers: proxyReq._headers,
        }));
        console.log(chalk.blue('Paste cookie in case proxy backend:'));
    });

    proxy.on('proxyRes', (proxyRes, req, res) => {
        console.log(JSON.stringify({
            middleware: 'backendProxyMiddleware',
            event: 'proxyRes',
            headers: proxyRes.headers,
        }));
        console.log(chalk.blue('Paste cookie in case proxy backend:'));
    });

    return function (regexes) {
        return function (req, res, next) {
            let skip = true;

            for (let i = 0, len = regexes.length; i < len; i++) {
                if (regexes[i].test(req.url)) {
                    skip = false;

                    proxy.web(req, res);

                    console.log(JSON.stringify({
                        middleware: 'backendProxyMiddleware',
                        regex: regexes[i].toString(),
                        'req.originUrl': req.originUrl,
                        'req.url': req.url,
                        'req.query': req.query,
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
