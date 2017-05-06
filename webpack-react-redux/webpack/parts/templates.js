const HtmlWebpackPlugin = require('html-webpack-plugin');
const defaultTemplate = require.resolve('html-webpack-plugin/default_index.ejs');

exports.page = function({
    entry,
    filename,
    chunks,
    template = defaultTemplate
} = {}) {
    return {
        entry,
        plugins: [
            new HtmlWebpackPlugin({
                template,
                filename,
                chunks
            })
        ]
    };
};
