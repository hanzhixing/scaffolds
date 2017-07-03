const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');

const fonts = require('./parts/fonts');
const images = require('./parts/images');
const styles = require('./parts/styles');
const scripts = require('./parts/scripts');
const miscs = require('./parts/miscs');

module.exports = function (paths) {
    return function (env) {
        return merge([
            {
                entry: {
                    'agile-frontend-react': path.resolve(paths.src, 'isolates/index.js')
                },
                output: {
                    library: 'agile-frontend-react',
                    libraryTarget: 'amd',
                    filename: 'scripts/[name].min.js',
                },
                externals: [
                    // 'animate.css',
                    // 'antd',
                    // 'babel-polyfill',
                    // 'bootstrap',
                    // 'font-awesome',
                    // 'immutable',
                    // 'normalizr',
                    'react',
                    // 'react-dnd',
                    // 'react-dnd-html5-backend',
                    'react-dom'
                    // 'react-intl',
                    // 'react-redux',
                    // 'react-router',
                    // 'redux',
                    // 'redux-actions',
                    // 'redux-thunk',
                ],
                performance: {
                    hints: 'warning', // 'error' or false are valid too
                    maxEntrypointSize: 393216, // in bytes
                    maxAssetSize: 262144 // in bytes
                },
                plugins: [
                    new webpack.HashedModuleIdsPlugin(),
                    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
                    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh/),
                ],
                // recordsPath: path.resolve(paths.build, 'records.json')
            },
            miscs.setVariables(env, [
                'PROJECT_PRIMARY_API_SERVER',
            ]),
            fonts.load({
                options: {
                    limit: 32768,
                    name: '[name].[hash].[ext]',
                    outputPath: './fonts/',
                    publicPath: '../'
                }
            }),
            images.load({
                options: {
                    limit: 32768,
                    name: '[name].[hash].[ext]',
                    outputPath: './fonts/',
                    publicPath: '../'
                }
            }),
            styles.split({
                options: {
                    filename: 'styles/[name].min.css',
                }
            }),
            styles.purify({
                paths: glob.sync(path.join(paths.src, '**', '*'), { nodir: true })
            }),
            styles.minify({
                options: {
                    discardComments: {
                        removeAll: true
                    },
                    safe: true
                }
            }),
            scripts.minify({useSourceMap: true}),
            // scripts.splitVendors([
            //   {
            //     name: 'vendor',
            //     minChunks: function (module) {
            //       // this assumes your vendor imports exist in the node_modules directory
            //       return module.context && module.context.indexOf('node_modules') !== -1;
            //     }
            //   },
            //   {
            //     name: 'manifest',
            //     minChunks: Infinity,
            //   },
            // ]),
            miscs.attachRevision(),
            // miscs.analyzeBunndle(),
            miscs.sourceMaps({type: 'source-map'}),
        ]);
    };
};
