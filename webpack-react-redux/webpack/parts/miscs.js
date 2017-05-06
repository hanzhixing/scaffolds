const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const GitRevisionPlugin = require('git-revision-webpack-plugin');

exports.analyzeBunndle = function() {
    return {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                analyzerHost: '0.0.0.0',
                analyzerPort: 8888,
                reportFilename: 'report.html',
                openAnalyzer: false,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info'
            })
        ]
    };

}

exports.sourceMaps = function({ type }) {
    return {
        devtool: type
    };
};


exports.attachRevision = function() {
    return {
        plugins: [
            new webpack.BannerPlugin({
                banner: new GitRevisionPlugin().version()
            })
        ]
    };
};

exports.setFreeVariable = function(key, value) {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env)
        ]
    };
};

exports.ignore = function({ test, include, exclude }) {
    return {
        module: {
            rules: [
                {
                    test,
                    include,
                    exclude,
                    use: 'null-loader'
                }
            ]
        }
    };
};
