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
    if (! this._hasStory()) {
      return false;
    }

    let decoded = Buffer.from(this.body.star.story, 'hex').toString();
    this.body.star.storyDecoded = decoded;
  }

  isValid() {
    if (! this._hasStory()) {
      return false;
    }

    let story = this.body.star.story;
    let storyWords = story.split(' ').length;
    let storyBytes = Buffer.byteLength(story, 'utf8');
    let isAscii = this._isASCII(story);

    return storyWords <= 250 && storyBytes <= 500 && isAscii
  }

  _isASCII(story) {
    return /^[\x00-\x7F]*$/.test(story);
  }

  _hasStory() {
    return this.body.star !== undefined && this.body.star.story !== undefined
  }
}

module.exports = Block;