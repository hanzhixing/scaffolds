const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv').config();
const merge = require('webpack-merge');

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
                filename: 'demo.xyz.html',
                chunks: ['demo.xyz'],
            }),
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
            //   filename: 'demo.box-chain.html',
            //   chunks: ['demo.box-chain', 'agile-frontend-react'],
            // })
        ];
    }
};

/**
 * 环境变量覆盖规则
 * 0. 围绕着webpack的特殊参数--env进行管理。
 * 1. .env文件中的变量一律小写，并一律带前缀“project_”。从这个文件中去掉project_前缀获得的变量名列表是可用变量名的最大集合。
 * 2. export NODE_ENV=development，会用NODE_ENV的值覆盖env的值。
 * 3. npm run xxx -- --env.xxx yyy，会用env.xxx的值yyy覆盖同名变量。
 */
module.exports = function defaultExports(envFromCli = {}) {
    const envFromDotenv = {};

    console.log(chalk.blue('[dotenv.parsed]: '), dotenv.parsed);

    Object.keys(dotenv.parsed).map(function (key, index) {
        const unPrefixedKey = key.replace('project_', '');
        envFromDotenv[unPrefixedKey] = dotenv.parsed[key];
    });

    console.log(chalk.blue('[dotenv.parsed (prefix removed)]: '), envFromDotenv);

    if (process.env.NODE_ENV) {
        envFromDotenv.env = process.env.NODE_ENV;
    }

    console.log(chalk.blue('[NODE_ENV]: '), process.env.NODE_ENV);

    console.log(chalk.blue('[env from webpack cli args]: '), envFromCli);

    const env = Object.assign({}, envFromDotenv, envFromCli);

    console.log(chalk.blue('[final env going to be used]: '), env);

    if (!(Object.keys(environments).indexOf(env.env) !== -1)) {
        return new Error(`Invalid environment: ${env.env}`);
    }

    // 为babel设置环境变量
    process.env.BABEL_ENV = env.env;

    return merge([
        environments.common,
        environments[env.env](env),
    ].concat(pages(env.env)));
};
