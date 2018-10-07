const Hapi = require('hapi');
const Handler = require('./handlers/block');

class Server {
  constructor(handler = null) {
    this.handler = handler || new Handler();
    this.hapi = Hapi.server({
      port: 8888
    });

    this.setupRoutes();
  }

  setupRoutes() {
    this.hapi.route({
      method: 'GET',
      path: '/block/{heightParam}',
      handler: this.handler.getBlock.bind(this.handler)
    });

    this.hapi.route({
      method: 'POST',
      path: '/block',
      handler: this.handler.postBlock.bind(this.handler)
    });

    this.hapi.route({
      method: 'POST',
      path: '/requestValidation',
      handler: this.handler.requestValidation.bind(this.handler)
    });

    this.hapi.route({
      method: 'POST',
      path: '/validate',
      handler: this.handler.validate.bind(this.handler)
    });
  }

  start() {
    this.hapi.start();

    console.log(`Server running at ${this.hapi.info.uri}`);
  }
}

module.exports = Server;