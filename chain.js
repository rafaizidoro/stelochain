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

    await this.chain.put(blockHeight, JSON.stringify(newBlock));
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
      return null;
    }
  }

  async validateBlock(blockHeight) {
    let valid = true;
    let block = await this.getBlock(blockHeight);

    let nextBlock = await this.getBlock(blockHeight+1);

    if (nextBlock !== null && nextBlock.previousHash !== block.hash) {
      valid = false;
    }

    let blockHash = block.hash;
    block.hash = '';

    let validBlockHash = SHA256(JSON.stringify(block)).toString();

    if (blockHash === validBlockHash) {
      valid = false;
    }

    return { height: blockHeight, valid: valid }
  }

  validateChain() {
    let errorLog = [];
    for (var i = 0; i < this.chain.length - 1; i++) {
      // validate block
      if (!this.validateBlock(i)) errorLog.push(i);
      // compare blocks hash link
      let blockHash = this.chain[i].hash;
      let previousHash = this.chain[i + 1].previousBlockHash;
      if (blockHash !== previousHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: ' + errorLog);
    } else {
      console.log('No errors detected');
    }
  }
}

module.exports.Block = Block
module.exports.Blockchain = Blockchain