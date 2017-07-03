const path = require('path');
const merge = require('webpack-merge');

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
        scripts.load({
            include: paths.src
        }),
        miscs.ignore({
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            include: /font-awesome/
        })
    ]);
}
