const Block = require('../../../lib/block');

test('populates body on constructor', () => {
  let data = { "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": { "dec": 0, "ra": 0, "story": "Big Bang just happened" } }
  let block = new Block(data);

  expect(block.body).toEqual(data);
});

test('parses string', () => {
  let data = {
    body: {
      address: "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF",
      star: {
        dec: "-26° 29' 25.9",
        ra: "16h 29m 1.0s",
        story: "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      }
    },
    height: 1,
    time: "1539000549",
    previousBlockHash: "5f6563225ff600f737aa85034d43d401399d70eeccacffe4cd501a101ac1bf49",
    hash: "8281a87d5f7a18f1f8c9bd5c4160eb4a829389b2533db65fd86162a01d65dea9"
  }

  let str = JSON.stringify(data);

  let block = new Block("");
  block.fill(str);

  expect(block).toEqual(data);
});

test('decode story', () => {
  let data = { "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": { "dec": 0, "ra": 0, "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f" } }
  let block = new Block(data);

  block.decodeStory();

  expect(block.body.star.storyDecoded).toEqual("Found star using https://www.google.com/sky/")
});