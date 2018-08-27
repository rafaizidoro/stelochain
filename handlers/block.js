let Chain = require('../lib/chain');
let Block = require('../lib/block');

let chain = new Chain();

class Handler {
  async getBlock(req, res) {
    let height = parseInt(req.params.heightParam);
    console.log(`[GET] /block/${height}`);

    if (isNaN(height) || height < 0) {
      return res.response({ error: `block height must be present and be a positive number` }).code(404);
    }

    let block = await chain.getBlock(height);

    if (block === null) {
      return res.response({ error: `cannot find block ${height}` }).code(404);
    }

    return res.response(block).code(200);
  }

  async postBlock(req, res) {
    console.log(`[POST] /block/ - ${JSON.stringify(req.payload)}`);

    if (req.payload === null || req.payload.body === undefined) {
      return res.response({ error: 'the field "body" must be present' }).code(400);
    }

    let block = await chain.addBlock(new Block(req.payload.body));

    return block;
  }
}

module.exports = new Handler();