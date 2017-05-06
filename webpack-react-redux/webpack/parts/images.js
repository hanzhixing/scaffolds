exports.load = function({ include, exclude, options } = {}) {
    return {
        module: {
            rules: [
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
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
