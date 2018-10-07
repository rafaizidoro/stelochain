let Chain = require('../lib/chain');
let Block = require('../lib/block');
let Auth = require('../lib/auth');

class Handler {
  constructor(path=null) {
    this.chain = path ? new Chain(path) : new Chain();
  }

  async getBlock(req, res) {
    let height = parseInt(req.params.heightParam);
    console.log(`[GET] /block/${height}`);

    if (isNaN(height) || height < 0) {
      return res.response({ error: `block height must be present and be a positive number` }).code(404);
    }

    let block = await this.chain.getBlock(height);

    if (block === null) {
      return res.response({ error: `cannot find block ${height}` }).code(404);
    }

    return res.response(block).code(200);
  }

  async postBlock(req, res) {
    console.log(`[POST] /block/ - ${JSON.stringify(req.payload)}`);

    if (req.payload === null || req.payload.address === undefined || req.payload.star === undefined) {
      return res.response({ error: 'the fields "address" and "star" must be present' }).code(400);
    }

    let auth = new Auth(req.payload.address);
    await auth.get();

    if (! auth.registerStar) {
      return res.response({ error:  `the address #${auth.address} is not allowed to register a star` }).code(401);
    }

    let newBlock = await this.chain.addBlock({ body: req.payload });

    return newBlock;
  }

  async requestValidation(req, res) {
    console.log(`[POST] /requestValidation/ - ${JSON.stringify(req.payload)}`);

    let auth = new Auth(req.payload.address);

    if ( await auth.exists() ) {
      await auth.get();
    } else {
      await auth.create();
    }

    let validationWindow = await auth.ttl();

    let response = {
      address: auth.address,
      requestTimeStamp: auth.requestTimestamp,
      message: auth.message,
      validationWindow: validationWindow
    };

    return res.response(response).code(200);
  }

  async validate(req, res) {
    console.log(`[POST] /validate/ - ${JSON.stringify(req.payload)}`);

    if ( req.payload.address === null || req.payload.signature === null ) {
      return res.response({ error: 'the fields "address" and "signature" must be present' }).code(400);
    }

    let auth = new Auth(req.payload.address);

    if (! await auth.exists()) {
      return res.response({ error: `the address ${auth.address} cannot be found`}).code(404);
    }

    if (! await auth.sign(req.payload.signature)) {
      return res.response({ error: 'invalid signature' }).code(401);
    }

    let response = {
      registerStar: auth.registerStar,
      status: {
        address: auth.address,
        requestTimeStamp: auth.requestTimestamp,
        message: auth.message,
        validationWindow: auth.validationWindow,
        messageSignature: 'valid'
      }
    }

    return res.response(response).code(200);
  }
}

module.exports = Handler;