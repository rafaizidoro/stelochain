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
  let genesis = {"address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": {"dec": 0, "ra": 0, "story": "5468652054696d65732030302f30302f303020546865204269672042616e67206a7573742068617070656e6564" }}

  setTimeout(async() => {
    let genesisBlock = await chain.getBlock(0);
    expect(genesisBlock.body).toEqual(genesis);

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

      let b1 = await chain.addBlock(new Block({"address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": {"dec": "+38° 47′ 1″", "ra": "18h 36m 56s", "story": "Vega"} }));
      let b2 = await chain.addBlock(new Block({"address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": {"dec": "-16° 42′ 58″", "ra": "6h 45m 9s", "story": "Sirius"} }));

      expect(chain.getBlockHeight()).toEqual(2);

      done();
    }
  }, 100);
});

it('returns the block info', async (done) => {
  let chain = new Chain(path + 'chain4');

  setTimeout(async() => {
    let genesisBlock = await chain.getBlock(0);
    let genesis = {"address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": {"dec": 0, "ra": 0, "story": "5468652054696d65732030302f30302f303020546865204269672042616e67206a7573742068617070656e6564"}}

    expect(genesisBlock.height).toEqual(0);
    expect(genesisBlock.hash).not.toBeNull();
    expect(genesisBlock.time).not.toBeNull();
    expect(genesisBlock.body).toEqual(genesis);

    done();
  }, 100)
})