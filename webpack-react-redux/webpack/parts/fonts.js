exports.load = function({ include, exclude, options } = {}) {
    return {
        module: {
            rules: [
                {
                    test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
                    include,
                    exclude,
                    use: {
                        loader: 'url-loader',
                        options
                    }
                }
            ]
        }
    };
};
