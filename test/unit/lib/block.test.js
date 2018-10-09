const Block = require('../../../lib/block');

test('constructor', () => {
  let data = { "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": { "dec": 0, "ra": 0, "story": "Big Bang just happened" } }
  let block = new Block(data);

  expect(block.body).toEqual(data);
});

test('fill', () => {
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

test('is valid', () => {
  let data = { "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": { "dec": 0, "ra": 0, "story": "Satoshi Nakamoto Rules" } }
  let block = new Block(data);

  expect(block.isValid()).toEqual(true);
});

test('is not valid - not ascii chars', () => {

  let data = { "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": { "dec": 0, "ra": 0, "story": "çatoshí Nákamoto" } }
  let block = new Block(data);

  expect(block.isValid()).toEqual(false);
});

test('is not valid - gt 250 chars', () => {
  let words = 'cc cc bb cc aa aa bb cc cc cc bb cc bb bb cc cc cc aa cc aa bb aa aa aa aa aa aa bb cc aa aa bb aa bb bb cc bb cc bb aa bb bb aa cc aa aa aa aa cc cc cc aa bb aa aa cc aa cc cc bb aa cc cc cc aa bb aa bb cc cc cc aa cc bb bb bb cc bb cc bb cc aa cc aa cc aa aa aa aa aa aa bb aa cc bb bb cc aa aa bb cc aa cc aa bb bb aa aa bb aa cc aa bb aa bb cc cc bb bb bb cc aa cc bb aa bb bb cc bb bb aa cc cc aa bb aa bb bb aa cc cc cc bb bb bb cc bb aa bb aa aa aa aa bb cc bb cc cc bb cc aa cc aa bb bb cc aa bb aa cc bb cc cc aa aa bb cc cc cc cc bb bb cc aa bb bb cc aa aa cc cc bb aa bb cc bb aa aa bb bb aa aa cc aa bb bb bb cc cc cc bb cc bb cc cc cc aa bb aa bb cc cc bb cc aa aa bb bb aa cc cc bb bb cc cc cc aa cc cc cc aa bb bb cc cc cc bb cc aa bb bb cc aa cc bb bb aa cc aa cc';
  let data = { "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": { "dec": 0, "ra": 0, "story": words } }
  let block = new Block(data);

  expect(block.isValid()).toEqual(false);
});

test('is not valid - gt 500 bytes', () => {
  let words = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel malesuada sem. Aenean mattis faucibus eleifend. Curabitur non nisi ut dolor interdum feugiat sit amet sit amet lorem. Etiam hendrerit commodo tortor a maximus. Nulla pulvinar vitae velit lacinia rhoncus. Aliquam sed bibendum elit. Maecenas consequat mollis ultrices. Sed orci metus, cursus in lobortis a, posuere eget nulla. Etiam iaculis lorem et tincidunt faucibus. Quisque commodo pulvinar gravida. Sed consequat dui a iaculis laoreet. Sed euismod quam laoreet nunc mattis, quis suscipit ex posuere. Nulla posuere enim massa, vitae ornare lacus sagittis a. Duis sit amet aliquam mauris. Nam ultrices.'
  let data = { "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": { "dec": 0, "ra": 0, "story": words } }
  let block = new Block(data);

  expect(block.isValid()).toEqual(false);
});


