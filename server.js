const Hapi = require('hapi');

const Handler = require('./handlers/block');
handler = new Handler();

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/block/{heightParam}',
    handler: handler.getBlock.bind(handler)
});

server.route({
    method: 'POST',
    path: '/block',
    handler: handler.postBlock.bind(handler)
});


module.exports = server;