let chain = require('./chain');
let quotes = require('./quotes');

let blockchain = new chain.Blockchain();

// We must only execute commands on the start callback
// This allows the blockchain to be synced before doing any change.
blockchain.start(async (bc) => {
  // Create a set of blocks
  for (var quote of quotes) {
    await bc.addBlock(new chain.Block(quote));
  }

  // Chain should be valid on the first run.
  let invalidBlocks = await bc.validateChain();
  console.log("Chain before tampering. Valid?", invalidBlocks.length === 0);

  // Tamper genesis block
  // PS: If you already tampered on another run, you MUST `rm -rf ./chaindata`
  genesisBlock = await bc.getBlock(1);
  tamperedBlock = Object.assign(genesisBlock, { body: "Tampered" });
  await bc.chain.db.put(1, JSON.stringify(tamperedBlock));

  // Chain should be invalid
  invalidBlocks = await bc.validateChain();
  console.log("Chain after tampering. Valid?", invalidBlocks.length === 0);
  console.log("Invalid blocks:", invalidBlocks.map( block => block.height ));
});