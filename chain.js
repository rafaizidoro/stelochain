const SHA256 = require('crypto-js/sha256');
const Storer = require('./storer');

class Block {
  constructor(data) {
    this.hash = "",
      this.height = 0,
      this.body = data,
      this.time = 0,
      this.previousBlockHash = ""
  }
}

class Blockchain {
  constructor() {
    this.chain = Storer;
  }

  start(callback) {
    let self = this;
    this.chain.sync(async (lastKey) => {
      if (lastKey == 0) {
        await self.addBlock(new Block("The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"));
      }

      callback(this);
    });
  }

  async addBlock(newBlock) {
    let blockHeight =  this.chain.lastKey+1;

    newBlock.height = blockHeight;
    newBlock.time = new Date().getTime().toString().slice(0, -3);

    // previous block hash
    if (this.chain.lastKey > 0) {
      let lastBlock = await this.getBlock(this.chain.lastKey);
      newBlock.previousBlockHash = lastBlock.hash
    }

    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

    let blockString = JSON.stringify(newBlock);

    await this.chain.put(blockHeight, blockString);

    console.log("[INFO] New Block: ", blockString);
    return newBlock;
  }

  getBlockHeight() {
    return this.chain.lastKey;
  }

  async getBlock(blockHeight) {
    try {
      let block = await this.chain.get(blockHeight);

      return JSON.parse(block);
    } catch(e) {
      console.log("[ERROR] Cannot retrieve block at height", blockHeight);
      return null;
    }
  }

  async validateBlock(blockHeight) {
    let valid = true;
    let block = await this.getBlock(blockHeight);

    let nextBlock = await this.getBlock(blockHeight+1);

    if (nextBlock !== null && nextBlock.previousBlockHash !== block.hash) {
      valid = false;
    }

    let blockHash = block.hash;
    block.hash = '';

    let validBlockHash = SHA256(JSON.stringify(block)).toString();

    if (blockHash !== validBlockHash) {
      valid = false;
    }

    return { height: blockHeight, valid: valid };
  }

  async validateChain() {
    let invalidBlocks = [];

    for (var i = 1; i <= this.chain.lastKey; i++) {
      let block = await this.validateBlock(i);

      if (!block.valid) {
        invalidBlocks.push(block);
      }
    }

    return invalidBlocks;
  }
}

module.exports.Block = Block
module.exports.Blockchain = Blockchain