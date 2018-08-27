const SHA256 = require('crypto-js/sha256');
const Storer = require('./storer');
const Block = require('./block');

class Chain {
  constructor() {
    this.mempool = []; // array to hold blocks before sync is complete

    this.chain = new Storer('./chaindata');
    this.chainLocked = this.chain.locked;

    this.chain.sync(async (lastKey) => {
      this.chainLocked = false;

      if (lastKey == 0) {
        await this.addBlock(new Block("The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"));
      }

      for (var block of this.mempool) {
        await this.addBlock(block);
      }
    });
  }

  async addBlock(newBlock) {
    // While chain is locked, we store blocks into mempool.
    // It will remain there until sync is complete.
    if (this.chainLocked) {
      this.mempool.push(newBlock);

      return new Promise( (resolve, reject) => {
        const interval = setInterval(() => {
          if (! this.chainLocked) {
            clearInterval(interval);
            resolve(true);
          }
        }, 100);
      });
    }

    let blockHeight =  this.chain.lastKey;

    newBlock.height = blockHeight;
    newBlock.time = new Date().getTime().toString().slice(0, -3);

    // previous block hash
    if (this.chain.lastKey > 0) {
      let lastBlock = await this.getBlock(this.chain.lastKey-1);
      newBlock.previousBlockHash = lastBlock.hash
    }

    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

    let blockString = JSON.stringify(newBlock);

    console.log(`[INFO] New Block: ${blockString}`.cyan);

    await this.chain.put(blockHeight, blockString);

    return newBlock;
  }

  getBlockHeight() {
    let height = this.chain.lastKey - 1;

    return height;
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

    for (var i = 0; i <= this.chain.lastKey-1; i++) {
      let block = await this.validateBlock(i);

      if (!block.valid) {
        invalidBlocks.push(block);
      }
    }

    return invalidBlocks;
  }
}

module.exports = Chain;