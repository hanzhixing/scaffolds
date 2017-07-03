const fs = require('fs');
const path = require('path');
const url = require('url');
const chalk = require('chalk');
const express = require('express');
const jsonServer = require('json-server');
const cors = require('cors');

const env = require('./env');
const backendProxyMiddleware = require('./middlewares/backendProxyMiddleware');
const jsonServerRequestAdapter = require('./middlewares/jsonServerRequestAdapter');
const jsonServerResponseAdapter = require('./middlewares/jsonServerResponseAdapter');
const staticJsonResponse = require('./middlewares/staticJsonResponse');
const httpProxy = require('http-proxy');
const targets = require('./targets');

const server = express();

const mockServerUrl = url.parse(env.PROJECT_MOCK_SERVER);
const primaryApiServerProxyUrl = url.parse(env.PROJECT_PRIMARY_API_SERVER_PROXY);

const backendProxyConfig = {
    target: env.PROJECT_PRIMARY_API_SERVER_PROXY,
    headers: {
        cookie: fs.readFileSync(path.resolve(__dirname, './COOKIE'), 'utf8').trim(),
    },
    cookieDomainRewrite: {
        [mockServerUrl.host]: primaryApiServerProxyUrl.host,
    },
    changeOrigin: true
};

const proxy = httpProxy.createProxyServer(backendProxyConfig);

const jsonServerRouter = jsonServer.router(path.join(__dirname, 'db.json'));

jsonServerRouter.render = jsonServerResponseAdapter(
    targets.filter(target => (target.mode === 'json-server'))
        .map(target => {
            const rule = {
                regex: target.regex,
            };

            if (target.meta && target.meta.responseDecorate) {
                rule.responseDecorate = target.meta.responseDecorate;
            }

            return rule;
        })
);

server.use([
    cors(),
    staticJsonResponse(
        path.join(__dirname, 'mock')
    )(
        targets.filter(target => (target.mode === 'static'))
            .map(target => (target.regex))
    ),
    backendProxyMiddleware(
        proxy
    )(
        targets.filter(target => (target.mode === 'proxy-backend'))
            .map(target => (target.regex))
    ),
    jsonServerRequestAdapter(
        targets.filter(target => (target.mode === 'json-server'))
            .map(target => {
                const rule = {
                    regex: target.regex,
                };

                if (target.meta && target.meta.urlRewrite) {
                    rule.urlRewrite = target.meta.urlRewrite;
                }

                if (target.meta && target.meta.responseDecorate) {
                    rule.responseDecorate = target.meta.responseDecorate;
                }

                return rule;
            })
    ),
    jsonServer.defaults(),
    jsonServerRouter,
]);

process.openStdin().addListener('data', (d) => {
    const cookie = d.toString().trim();
    if (cookie) {
        backendProxyConfig.headers.cookie = cookie;
    }
});

server.listen(
    mockServerUrl.port,
    mockServerUrl.hostname,
    () => {
        console.log(chalk.yellow(
            'Mock Server is listening on:',
            mockServerUrl.port,
            ':',
            mockServerUrl.hostname
        ));
        console.log(chalk.blue('Paste cookie in case proxy backend:'));
    }
);
