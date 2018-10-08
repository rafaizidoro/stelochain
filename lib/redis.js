const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient();

module.exports.get = promisify(client.get).bind(client);
module.exports.ttl = promisify(client.ttl).bind(client);
module.exports.exists = promisify(client.exists).bind(client);
module.exports.hgetall = promisify(client.hgetall).bind(client);
module.exports.hmset = promisify(client.hmset).bind(client);
module.exports.set = promisify(client.set).bind(client);
module.exports.sadd = promisify(client.sadd).bind(client);
module.exports.smembers = promisify(client.smembers).bind(client);
module.exports.expire = promisify(client.expire).bind(client);
module.exports.del = promisify(client.del).bind(client);