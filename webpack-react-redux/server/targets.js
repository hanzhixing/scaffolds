// regex是分mode按顺序匹配, 只要匹配就不会继续匹配同mode剩余regex.
// regex写的尽量具体, 避免出现一个正则规则包含另一个正则规则的情况.
// mode: proxy-backend|json-server|static
// meta信息只有mode: 'json-server'时才会起作用.
// meta.responseDecorate是方法数组, 依次执行. 前一个方法的返回值成为下一个方法的finalRes.
module.exports = [
    {
        regex: /^\/rest\/v1\/abc\/\d+/,
        mode: 'static',
    },
    {
        regex: /^\/rest\/v1\/xyz\/\d+/,
        mode: 'proxy-backend',
    },
    {
        regex: /^\/rest\/v1\/xxxyyy\?.*/,
        mode: 'json-server',
        meta: {
            urlRewrite: [
                {
                    from: /\/rest\/v1/,
                    to: '',
                }
            ],
            responseDecorate: [
                (res, finalRes) => (
                    Object.assign({}, finalRes, {
                        total: res.get('X-Total-Count').value(),
                        entities: {
                            xxxyyy: res.locals.data,
                        },
                    })
                ),
            ]
        },
    },
];
