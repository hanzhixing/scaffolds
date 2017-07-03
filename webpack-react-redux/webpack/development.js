const path = require('path');
const url = require('url');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WriteFilePlugin = require('write-file-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const styles = require('./parts/styles');
const images = require('./parts/images');
const fonts = require('./parts/fonts');
const scripts = require('./parts/scripts');
const miscs = require('./parts/miscs');

module.exports = function (paths) {
    return function (env) {
        const webpackDevServerUrl = url.parse(env.PROJECT_WEBPACK_DEV_SERVER);
        const primaryApiServerUrl = url.parse(env.PROJECT_PRIMARY_API_SERVER);

        return merge([
            {
                entry: {
                    'demo.box-chain': [
                        path.resolve(paths.src, 'isolates/demo.abc.jsx'),
                        'react-hot-loader/patch',
                        `webpack-dev-server/client?${env.PROJECT_WEBPACK_DEV_SERVER}`,
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
                    host: webpackDevServerUrl.hostname,
                    port: webpackDevServerUrl.port,
                    proxy: [
                        {
                            context: ['/xxxx/rest/v1', '/rest/v1', '/yyyyy'],
                            target: env.PROJECT_PRIMARY_API_SERVER,
                            changeOrigin: true,
                        },
                    ],
                    // Now we can take away proxy settings above.
                    // In this case, we send async requests with full url, with scheme,domain and port.
                    // The scheme, domain and port are taken from environment(CLI or .env file).
                    // See miscs.setVariables() below.
                    // But we have to wait until finish migration from grunt to webpack.
                },
                plugins: [
                    new webpack.NamedModulesPlugin(),
                    new webpack.HotModuleReplacementPlugin(),
                    // new FaviconsWebpackPlugin(path.resolve(paths.src, 'components/favicon.ico')),
                    // new WriteFilePlugin({log: false}),
                ],
            },
            // miscs.setVariables(env, [
            //     'PROJECT_PRIMARY_API_SERVER',
            // ]),
            fonts.load({
                options: {
                    limit: 32768,
                    name: '[name].[hash].[ext]',
                    outputPath: './fonts/',
                }
            }),
            images.load({
                options: {
                    limit: 32768,
                    name: '[name].[hash].[ext]',
                    outputPath: './fonts/',
                }
            }),
            styles.load(),
            miscs.sourceMaps({
                type: 'inline-source-map'
            })
        ]);
    };
};
