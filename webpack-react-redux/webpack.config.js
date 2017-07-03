const path = require('path');
const merge = require('webpack-merge');

const projectEnv = require('./webpack/env');
const templates = require('./webpack/parts/templates');

const envCommon = require('./webpack/common');
const envDevelopment = require('./webpack/development');
const envTesting = require('./webpack/testing');
const envStaging = require('./webpack/staging');
const envProduction = require('./webpack/production');

process.traceDeprecation = true;

const paths = {
    root: path.resolve(__dirname),
    src: path.resolve(__dirname, 'src'),
    build: path.resolve(__dirname, 'build'),
};

const environments = {
    common: envCommon(paths),
    development: envDevelopment(paths),
    testing: envTesting(paths),
    staging: envStaging(paths),
    production: envProduction(paths),
};

const pages = function (env) {
    if (env === 'development') {
        return [
            templates.page({
                template: path.resolve(paths.src, 'isolates/demo.ejs'),
                filename: 'demo.abc.html',
                chunks: ['demo.abc'],
            }),
        ];
    } else if (env === 'production') {
        return [
            // templates.page({
            //   template: path.resolve(paths.src, 'isolates/demo.ejs'),
            //   filename: 'demo.abc.html',
            //   chunks: ['demo.abc', 'xyz'],
            // })
        ];
    }
};

module.exports = function defaultExports(envFromCli = {}) {
    const env = projectEnv(envFromCli);

    return merge([
        environments.common,
        environments[env.PROJECT_TARGET_ENV](env),
    ].concat(pages(env.PROJECT_TARGET_ENV)));
};
