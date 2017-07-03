const chalk = require('chalk');
const querystring = require('querystring');

module.exports = function jsonServerRequestAdapter(rules) {
    return function (req, res, next) {
        let skip = true;

        for (let i = 0, len = rules.length; i < len; i++) {
            if (rules[i].regex.test(req.url)) {
                skip = false;

                if (rules[i].urlRewrite !== undefined
                    && rules[i].urlRewrite.length > 0
                ) {
                    console.log(JSON.stringify({
                        middleware: 'jsonServerRequestAdapter',
                        when: 'before url rewrite',
                        regex: rules[i].regex.toString(),
                        'req.url': req.url,
                    }));

                    rules[i].urlRewrite.forEach(rewrite => {
                        req.url = req.url.replace(rewrite.from, rewrite.to);
                    });

                    console.log(JSON.stringify({
                        middleware: 'jsonServerRequestAdapter',
                        when: 'after url rewrite',
                        regex: rules[i].regex.toString(),
                        'req.url': req.url,
                    }));
                }

                console.log(JSON.stringify({
                    middleware: 'jsonServerRequestAdapter',
                    when: 'before query rewrite',
                    regex: rules[i].regex.toString(),
                    'req.query': req.query,
                }));

                const newQuery = Object.assign({}, req.query);

                if (Object.keys(newQuery).length > 0) {
                    Object.keys(newQuery).forEach(key => {
                        // Filter.
                        // id=1,2,3 -->
                        // {
                        //     "id": ["1", "2", "3"]
                        // }
                        if (key.indexOf('_') === -1
                            && newQuery[key].indexOf(',') !== -1
                           ) {
                            newQuery[key] = newQuery[key].split(',');
                        }
                        // Paginate and Slice. We only use _offset and _limit for all paging.
                        // _offset=30&_limit=10 -->
                        // {
                        //     "_page": 4,
                        //     "_limit": 10
                        // }
                        if ('_offset' === key) {
                            newQuery['_page'] = Math.floor(newQuery['_offset'] / newQuery['_limit']) + 1;
                            newQuery['_limit'] = Number(newQuery['_limit']);
                            delete newQuery['_offset'];
                        }
                        // Sort
                        // _sort=-id,time -->
                        // {
                        //     "_sort": "id,name",
                        //     "_order": "desc,asc"
                        // }
                        if ('_sort' === key) {
                            const sorts = newQuery[key].split(',');
                            const fields = [];
                            const orders = [];
                            sorts.forEach(exp => {
                                const order = exp.substr(0, 1) === '-' ? 'desc' : 'asc';
                                orders.push(order);
                                if (order === 'desc') {
                                    fields.push(exp.substr(1));
                                } else {
                                    fields.push(exp);
                                }
                            });
                            delete newQuery['_sort'];
                            newQuery['_sort'] = fields.join(',');
                            newQuery['_order'] = orders.join(',');
                        }
                        // Operators
                        // id>=5 --> {"id_gte": 5}
                        // id<=5 --> {"id_lte": 5}
                        // id!=5 --> {"id_ne": 5}
                        // id%=5 --> {"id_like": 5}
                        if (['>', '<', '!', '%'].indexOf(key.substr(-1)) !== -1) {
                            const operator = key.substr(-1);
                            const map = {
                                '>': '_gte',
                                '<': '_lte',
                                '!': '_ne',
                                '%': '_like',
                            };
                            const newKey = key.substr(0, key.length - 1) + map[operator];
                            newQuery[newKey] = newQuery[key];
                            delete newQuery[key];
                        }
                        // Special
                        // the key 'name' in the url always use like clause
                        // name=abc --> {"name_like": "abc"}
                        if ('name' === key) {
                            newQuery['name_like'] = newQuery['name'];
                            delete newQuery['name'];
                        }
                    });
                }

                if (Object.keys(newQuery).length > 0) {
                    req.url = req.path + '?' + querystring.stringify(newQuery);
                    req.query = newQuery;
                }

                console.log(JSON.stringify({
                    middleware: 'jsonServerRequestAdapter',
                    when: 'after query rewrite',
                    regex: rules[i].regex.toString(),
                    'req.query': req.query,
                }));
                console.log(chalk.blue('Paste cookie in case proxy backend:'));

                break;
            }
        }

        next();
    };
};
