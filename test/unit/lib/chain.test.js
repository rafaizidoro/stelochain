const execSync = require('child_process').execSync;
const Chain = require('../../../lib/chain');
const Block = require('../../../lib/block');

const path = 'test/fixtures/chains/';

beforeAll(() => {
  console.log(`Creating ./${path}`);
  execSync(`mkdir ./${path}`);
});

afterAll(() => {
  console.log(`Cleaning ./${path}`);
  execSync(`rm -rf ./${path}`);
});

it('locks chain when starting', async () => {
  let chain = new Chain(path + 'chain1');

  expect(chain.chainLocked).toBe(true);
});

it('generates genesis block', async (done) => {
  let chain = new Chain(path + 'chain2');

  setTimeout(async() => {
    let genesisBlock = await chain.getBlock(0);
    expect(genesisBlock.body).toEqual("The Times 03/Jan/2009 Chancellor on brink of second bailout for banks");

    done();
  }, 100)
});

it('increments the block height', async (done) => {
  let chain = new Chain(path + 'chain3');

  let interval = setInterval(async () => {
    if (!chain.chainLocked) {
      clearInterval(interval);

      let height = chain.getBlockHeight();
      expect(height).toEqual(0);

      let b1 = await chain.addBlock(new Block('naka'));
      let b2 = await chain.addBlock(new Block('moto'));

      expect(chain.getBlockHeight()).toEqual(2);

      done();
    }
  }, 100);
});

it('returns the block info', async (done) => {
  let chain = new Chain(path + 'chain4');

  setTimeout(async() => {
    let genesisBlock = await chain.getBlock(0);

    expect(genesisBlock.height).toEqual(0);
    expect(genesisBlock.hash).not.toBeNull();
    expect(genesisBlock.time).not.toBeNull();
    expect(genesisBlock.body).toEqual("The Times 03/Jan/2009 Chancellor on brink of second bailout for banks");

    done();
  }, 100)
})