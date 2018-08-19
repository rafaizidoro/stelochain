const level = require('level');

class Storer {
  constructor(path) {
    this.path = path;
    this.db = level(path);
    this.lastKey = 0;
    this.locked = true;
    this.canStart = true;
  }

  async sync(callback) {
    if (typeof (callback) != 'function') {
      console.log('[ERROR] onReady arguments must be a callback function');
      return false;
    }

    if (this.canStart === false) {
      console.log('[ERROR] Read stream already started')
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
    } catch(e) {
      console.log('[ERROR] Cannot put data:', err);
    }
  }

  get(key) {
    return this.db.get(key);
  }

  _onLevelData(data) {
    if (data.value !== "") {
      try {
        console.log("[INFO]", "Fetching key #", data.key, " - ", data.value);
        this.lastKey++;
      } catch (e) {
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
    console.log("[INFO]", "SYNC COMPLETE");
  }
}

module.exports = new Storer('./chaindata');