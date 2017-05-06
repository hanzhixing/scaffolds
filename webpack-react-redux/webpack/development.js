const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WriteFilePlugin = require('write-file-webpack-plugin');

const styles = require('./parts/styles');
const scripts = require('./parts/scripts');
const miscs = require('./parts/miscs');

module.exports = function (paths) {
    return function (env) {
        return merge([
            {
                entry: {
                    // 'demo.box-chain': [
                    //     path.resolve(paths.src, 'isolates/demo.box-chain.jsx'),
                    //     'react-hot-loader/patch',
                    //     `webpack-dev-server/client?http://${env.dev_server_ip}:${env.dev_server_port}`,
                    //     'webpack/hot/only-dev-server',
                    // ],
                    'demo.dashboard': [
                        path.resolve(paths.src, 'isolates/demo.dashboard.jsx'),
                        'react-hot-loader/patch',
                        `webpack-dev-server/client?http://${env.dev_server_ip}:${env.dev_server_port}`,
                        'webpack/hot/only-dev-server',
                    ],
                },
                output: {
                    filename: 'scripts/[name].js',
                    devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
                },
                devServer: {
                    hot: true,
                    disableHostCheck: true,
                    host: env.dev_server_ip,
                    port: env.dev_server_port,
                    proxy: [
                        {
                            context: ['/rest/v1', '/agile'],
                            target: env.dev_server_proxy,
                            changeOrigin: true,
                        },
                    ],
                },
                plugins: [
                    new webpack.NamedModulesPlugin(),
                    new webpack.HotModuleReplacementPlugin(),
                    new WriteFilePlugin({log: false}),
                ],
            },
            styles.load(),
            miscs.sourceMaps({
                type: 'inline-source-map'
            })
        ]);
    };
};
