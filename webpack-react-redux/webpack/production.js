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
                    filename: env.minify === 'true' ? 'scripts/[name].min.js' : 'scripts/[name].js'
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
                    new webpack.HashedModuleIdsPlugin()
                ],
                recordsPath: path.resolve(paths.build, 'records.json')
            },
            miscs.setFreeVariable(
                'process.env.NODE_ENV',
                'production'
            ),
            styles.split({
                options: {
                    filename: env.minify === 'true' ? 'styles/[name].min.css' : 'styles/[name].css'
                }
            }),
            styles.purify({
                paths: glob.sync(path.join(paths.src, '**', '*'), { nodir: true })
            }),
            function () {
                if (env.minify) {
                    return scripts.minify({useSourceMap: true});
                }
            },
            function () {
                if (env.minify) {
                    return styles.minify({
                        options: {
                            discardComments: {
                                removeAll: true
                            },
                            safe: true
                        }
                    });
                }
            },
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
            miscs.analyzeBunndle(),
            function () {
                if (env.minify) {
                    return miscs.sourceMaps({type: 'source-map'});
                }
            }
        ]);
    };
};
