class Block {
  constructor(data) {
    this.hash = ""
    this.height = 0
    this.body = data
    this.time = 0
    this.previousBlockHash = ""
  }

  fill(string) {
    let parsed = JSON.parse(string);

    this.hash = parsed.hash;
    this.height = parsed.height;
    this.body = parsed.body;
    this.previousBlockHash = parsed.previousBlockHash;
    this.time = parsed.time;
 }

  decodeStory() {
    let decoded = Buffer.from(this.body.star.story, 'hex').toString();
    this.body.star.storyDecoded = decoded;
  }
}

module.exports = Block;