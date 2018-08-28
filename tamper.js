let Chain = require('./lib/chain');
let Block = require('./lib/block');
let quotes = require('./test/fixtures/quotes');

let blockchain = new Chain();
let blocks = [];

// Create a set of blocks
for (var quote of quotes) {
  blocks.push(blockchain.addBlock(new Block(quote)));
}

Promise.all(blocks).then(async (blocks) => {
  console.log(`[INFO] Blockchain Height: ${blockchain.getBlockHeight()}`.blue);

  // Chain should be valid on the first run.
  let invalidBlocks = await blockchain.validateChain();

  if (invalidBlocks.length > 0) {
    console.log("[ERROR] The chain is already tampered. Run `rm -rf ./chaindata` and execute this script again!".red);
  } else {
    console.log(`[INFO] Chain before tampering. Valid? ${invalidBlocks.length === 0}`.green);

    // Tamper genesis block
    // PS: If you already tampered on another run, you MUST `rm -rf ./chaindata`
    genesisBlock = await blockchain.getBlock(0);
    tamperedBlock = Object.assign(genesisBlock, { body: "Tampered" });

    // Insert the tampered block on database
    await blockchain.chain.db.put(0, JSON.stringify(tamperedBlock));

    // Chain should be invalid
    invalidBlocks = await blockchain.validateChain();
    console.log(`[WARNING] Chain after tampering. Valid?  ${invalidBlocks.length === 0}`.yellow);
    console.log(`[WARNING] Invalid block height: ${invalidBlocks.map( block => block.height)}`.yellow);
  }
});