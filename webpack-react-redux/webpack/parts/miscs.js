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
    const gitRevisionPlugin = new GitRevisionPlugin({
        lightweightTags: true,
        branch: true,
    });

    return {
        plugins: [
            new webpack.BannerPlugin({
                banner: JSON.stringify({
                    by: 'git',
                    version: gitRevisionPlugin.version(),
                    commithash: gitRevisionPlugin.commithash(),
                    branch: gitRevisionPlugin.branch(),
                })
            })
        ]
    };
};

exports.setVariables = function (env, keys) {
    const final = {};

    keys.forEach(key => {
        final[key] = JSON.stringify(env[key]);
    });

    return {
        plugins: [
            new webpack.DefinePlugin(final)
        ]
    };
};

exports.ignore = function ({ test, include, exclude }) {
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
