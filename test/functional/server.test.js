const execSync = require('child_process').execSync;
const request = require('supertest');
const Server = require('../../server');
const Handler = require('../../handlers/block');

let path = 'test/fixtures/chains/';
let server;

beforeAll(() => {
  console.log(`Creating ./${path}`);
  execSync(`mkdir -p ./${path}`);

  let random = new Date().getTime().toString().slice(0, -3);
  server = new Server(new Handler([path,'testchain',random].join('')));
});

afterAll(() => {
  console.log(`Cleaning ./${path}`);
  execSync(`rm -rf ./${path}`);
});

it('GET /block/0', (done) => {
  setTimeout(async () => {
    let response = await server.hapi.inject({method: 'GET', url: '/block/0'})
    let data = JSON.parse(response.payload);
    let genesis = {"address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF", "star": {"dec": 0, "ra": 0, "story": "5468652054696d65732030302f30302f303020546865204269672042616e67206a7573742068617070656e6564", "storyDecoded": "The Times 00/00/00 The Big Bang just happened"}}

    expect(response.statusCode).toEqual(200);
    expect(data.body).toEqual(genesis);
    expect(data.height).toEqual(0);
    expect(data.previousBlockHash).toEqual("");
    expect(data.hash).not.toBeNull();
    expect(data.time).not.toBeNull();

    done();
  }, 1000)
});

it('POST /block/0', (done) => {
  setTimeout(async () => {
    let response = await server.hapi.inject({method: 'POST', url: '/block', payload: {body: "Satoshi is Alive"}})
    let data = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(400);
    done();
  }, 1000)
});