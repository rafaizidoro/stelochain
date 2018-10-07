const redis = require('./redis');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const VALIDATION_WINDOW = 300; // validation window in seconds

class Auth {
  constructor(address) {
    this.address = address;
    this.requestTimestamp = null;
    this.validationWindow = null;
    this.message = null;
    this.registerStar = false;
  }

  async exists() {
    let key = await redis.exists(this.address);

    return key === 1;
  }

  async create() {
    this.requestTimestamp = new Date().getTime().toString().slice(0, -3);
    this.validationWindow = VALIDATION_WINDOW;
    this.message = `${this.address}:${this.requestTimestamp}:starRegistry`;

    await redis.hmset(this.address, 'requestTimestamp', this.requestTimestamp, 'registerStar', this.registerStar, 'message', this.message);
    await redis.expire(this.address, VALIDATION_WINDOW);

    return true;
  }

  async ttl() {
    this.validationWindow = await redis.ttl(this.address);

    return this.validationWindow;
  }

  async sign(signature) {
    let validation = await this.get();
    let validSignature = false;

    if (validation === null) {
      return false;
    }

    try {
      validSignature = bitcoinMessage.verify(this.message, this.address, signature);
    } catch(err) {
      return false;
    }

    if (validSignature) {
      await redis.hmset(this.address, 'registerStar', true);
      this.registerStar = true;

      return true;
    }

    return false;
  }

  async get() {
    let data = await redis.hgetall(this.address);

    if (data === null) {
      return null;
    }

    this.validationWindow = await this.ttl();
    this.requestTimestamp = data.requestTimestamp;
    this.message = data.message;
    this.registerStar = data.registerStar;
  }
}

module.exports = Auth;