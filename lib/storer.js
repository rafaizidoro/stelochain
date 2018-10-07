const level = require('level');
const colors = require('colors');
const redis = require('./redis');

class Storer {
  constructor(path) {
    this.path = path;
    this.db = level(path);
    this.lastKey = 0;
    this.locked = true;
    this.canStart = true;
  }

  sync(callback) {
    if (typeof (callback) != 'function') {
      console.log('[ERROR] sync arguments must be a callback function'.yellow);
      return false;
    }

    if (! this.canStart) {
      console.log('[ERROR] Read stream already started'.yellow)
      return false
    }

    if (this.locked) {
      this.canStart = false;
      this.db.createReadStream()
        .on('data', this._onLevelData.bind(this))
        .on('error', this._onLevelError.bind(this))
        .on('close', this._onLevelClose.bind(this, callback));
    }
  }

  async put(key, value) {
    if (this.locked) {
      console.log('[ERROR] Database is locked');
      return new Promise( (resolve, reject) => { reject(false); }) ;
    }

    try {
      let op = await this.db.put(key, value);
      this.lastKey++;

      await this.putCache({ key: key, value: value });
    } catch(e) {
      console.log('[ERROR] Cannot put data:', e);
    }
  }

  get(key) {
    return this.db.get(key);
  }

  async getByHash(hash) {
    let key = await redis.get('chain:hash:' + hash);

    if (!key) {
      return null;
    }

    return this.db.get(key);
  }

  async getByAddress(address) {
    let keys = await redis.smembers('chain:address:' + address);
    let blocks = [];

    if (keys.length > 0) {
      for(var key of keys) {
        let block = await this.db.get(key);
        blocks.push(block);
      }
    }

    return blocks;
  }

  async putCache(data) {
    let value = '';
    try {
      value = JSON.parse(data.value);
    } catch(e) {
      console.log(e);
    }

    // indexing data
    await redis.sadd(`chain:address:${value.body.address}`, data.key)
    await redis.set(`chain:hash:${value.hash}`, data.key)
  }

  _onLevelData(data) {
    if (data.value !== "") {
      try {
        console.log(`[INFO] Fetching key # ${data.key} - ${data.value}`.gray);
        this.putCache(data);

        this.lastKey++;
      } catch (e) {
        console.log(e);
        console.log("[ERROR]", "Invalid json data on key #", data.key)
      }
    }
  }

  _onLevelError(err) {
    console.log("[ERROR]", err);
  }

  _onLevelClose(callback) {
    this.locked = false;
    callback(this.lastKey);
  }
}

module.exports = Storer;