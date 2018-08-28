const Block = require('../../../lib/block');

test('populates body on constructor', () => {
  let data = 'Satoshi On a Jest';
  let block = new Block(data);

  expect(block.body).toEqual(data);
})