const path = require('path');
const dotenv = require('dotenv').config();
const express = require('express');
// const jsonServer = require('json-server');

const envFromDotenv = {};

Object.keys(dotenv.parsed).map(function (key, index) {
    const unPrefixedKey = key.replace('project_', '');
    envFromDotenv[unPrefixedKey] = dotenv.parsed[key];
});

if (process.env.NODE_ENV) {
    envFromDotenv.env = process.env.NODE_ENV;
}

const env = Object.assign({}, envFromDotenv);

const server = express();

// const jsonServerRouter = jsonServer.router(path.join(__dirname, 'mock.db.json'));

// server.use('/rest/v1', jsonServerRouter);
server.use(function (req, res, next) {
    console.log(req.originalUrl);
    console.log(req.baseUrl);
    console.log(req.method);
    console.log(req.params);
    console.log(req.path);
    console.log(req.query);
    const filepath = path.resolve(path.join(
        __dirname,
        './mock',
        req.baseUrl,
        req.path,
        req.method + '.json'
    ));
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(filepath);
});

server.listen(env.mock_server_port, env.mock_server_ip, () => {
    console.log('Listening on', env.mock_server_port, ':', env.mock_server_ip);
});
