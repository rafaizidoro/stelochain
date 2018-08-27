const Hapi = require('hapi');
const Chain = require('./lib/chain');
const Block = require('./lib/block');

const handler = require('./handlers/block');

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/block/{heightParam}',
    handler: handler.getBlock
});

server.route({
    method: 'POST',
    path: '/block',
    handler: handler.postBlock
});


module.exports = server;