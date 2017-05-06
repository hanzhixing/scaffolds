export default {
    api: {
        v1: '/rest/v1',
    },
    paths: {
        // base: '/amd/pages/',
        routerRoot: '/',
        avatar: {
            base: 'http://xyz.com/images/userimages',
            onerror: 'http://abc.com/error.png?__sprite',
        }
    },
    enabledRoutes: [
        /\/test\/.*/,
    ],
};
