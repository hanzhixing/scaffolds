const chalk = require('chalk');
const dotenv = require('dotenv').config();

const validEnvs = [
    'development',
    'testing',
    'staging',
    'production',
];

/**
 * 环境变量覆盖规则
 * 0. 围绕着webpack的特殊参数--env进行管理。
 * 1. .env文件中的变量一律小写，并一律带前缀“project_”。从这个文件中去掉project_前缀获得的变量名列表是可用变量名的最大集合。
 * 2. export NODE_ENV=development，会用NODE_ENV的值覆盖env的值。
 * 3. npm run xxx -- --env.xxx yyy，会用env.xxx的值yyy覆盖同名变量。
 */
module.exports = function env(envFromCli) {
    let env = dotenv.parsed;

    console.log(chalk.blue('[dotenv.parsed]: '), JSON.stringify(dotenv.parsed));
    console.log(chalk.blue('[envFromCli]: '), JSON.stringify(envFromCli));

    if (process.env.NODE_ENV && validEnvs.indexOf(process.env.NODE_ENV) !== -1) {
        env.PROJECT_TARGET_ENV = process.env.NODE_ENV;
    }

    env = Object.assign({}, env, envFromCli);

    if (validEnvs.indexOf(env.PROJECT_TARGET_ENV) === -1) {
        throw new Error(`Invalid PROJECT_TARGET_ENV: ${env.PROJECT_TARGET_ENV}`);
    }

    // 为babel设置环境变量
    process.env.BABEL_ENV = env.PROJECT_TARGET_ENV;

    console.log(chalk.blue('Final env:'), '\n', JSON.stringify(env));

    return env;
};
