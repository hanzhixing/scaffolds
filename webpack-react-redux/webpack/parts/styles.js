const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCssPlugin = require('purifycss-webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

exports.lint = function({ include, exclude }) {
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,
                    enforce: 'pre',
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => ([
                            require('stylelint')({
                                // Ignore node_modules CSS
                                ignoreFiles: 'node_modules/**/*.css'
                            })
                        ])
                    }
                }
            ]
        }
    };
};

exports.load = function({include, exclude} = {}) {
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        },
                        'postcss-loader'
                    ]
                },
                {
                    test: /\.less$/,
                    include,
                    exclude,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                // modules: true,
                                importLoaders: 2
                            }
                        },
                        'postcss-loader',
                        'less-loader'
                    ]
                }
            ]
        }
    };
};

exports.split = function({ include, exclude, options } = {}) {
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1
                                }
                            },
                            'postcss-loader'
                        ]
                    })
                },
                {
                    test: /\.less$/,
                    include,
                    exclude,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    // modules: true,
                                    importLoaders: 2
                                }
                            },
                            'postcss-loader',
                            'less-loader'
                        ]
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin(options)
        ]
    };
};

exports.purify = function({ paths }) {
    return {
        plugins: [
            new PurifyCssPlugin({paths: paths})
        ]
    };
};


exports.minify = function({ options }) {
    return {
        plugins: [
            new OptimizeCSSAssetsPlugin({
                cssProcessor: cssnano,
                cssProcessorOptions: options
            })
        ]
    };
};
