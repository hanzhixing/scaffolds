const chalk = require('chalk');
const dotenv = require('dotenv').config();

const env = dotenv.parsed || {};

const validEnvs = [
    'development',
    'testing',
    'staging',
    'production',
];

if (process.env.NODE_ENV && validEnvs.indexOf(process.env.NODE_ENV) !== -1) {
    env.PROJECT_TARGET_ENV = process.env.NODE_ENV;
}

console.log(chalk.yellow('Final env:'), JSON.stringify(env));

module.exports = env;
