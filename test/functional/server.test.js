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

    expect(response.statusCode).toEqual(200);
    expect(data.body).toEqual('The Times 03/Jan/2009 Chancellor on brink of second bailout for banks');
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

    expect(response.statusCode).toEqual(200);
    expect(data.body).toEqual('Satoshi is Alive');
    expect(data.height).toEqual(1);
    expect(data.previousBlockHash).not.toEqual("");
    expect(data.hash).not.toBeNull();
    expect(data.time).not.toBeNull();

    done();
  }, 1000)
});