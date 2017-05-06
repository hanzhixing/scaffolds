const webpack = require('webpack');

exports.lint = function({ include, exclude, options }) {
    return {
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include,
                    exclude,
                    enforce: 'pre',
                    loaders: 'eslint-loader',
                    options
                }
            ]
        }
    };
};

exports.splitVendors = function(bundles) {
    return {
        plugins: bundles.map(bundle => (
            new webpack.optimize.CommonsChunkPlugin(bundle)
        ))
    };
};

exports.load = function({ include, exclude }) {
    return {
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include,
                    exclude,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true // for performance
                    }
                }
            ]
        }
    };
};

exports.minify = function({ useSourceMap }) {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: useSourceMap,
                compress: {
                    warnings: false
                }
            })
        ]
    };
};
