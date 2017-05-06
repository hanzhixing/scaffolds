const path = require('path');
const merge = require('webpack-merge');

const fonts = require('./parts/fonts');
const images = require('./parts/images');
const styles = require('./parts/styles');
const scripts = require('./parts/scripts');
const miscs = require('./parts/miscs');

module.exports = function (paths) {
    return merge([
        {
            output: {
                path: paths.build
            },
            resolve: {
                extensions: ['.js', '.jsx']
            }
        },
        styles.lint({
            include: paths.src
        }),
        scripts.lint({
            include: paths.src
        }),
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
                publicPath: '../fonts/'
            }
        }),
        scripts.load({
            include: paths.src
        }),
        miscs.ignore({
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            include: /font-awesome/
        })
    ]);
}
