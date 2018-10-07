## Installation
After clone this project, you will need to install the npm modules:

```
    npm install
```

## Starting the API Server
To start the API server, you will need to run the following command:
```
 node app.js
```

This will open the server on port 8888 and will synchronize the blockchain.

The following endpoint are available:

### POST /block
This endpoint allows the client to create a block.

### GET /block/0
This endpoint allows the client to request a block.

## Running tests
The test were created using the Jest framework. To run the tests just execute:

```
 npm tests
```

**This code was developed with NodeJS v.8.12**

# File structure

## lib/chain.js
This file includes the main Chain class. It is responsible to set the Blockchain, sync database and do all the validations.

## lib/block.js
This file includes the Block class.

## lib/storer.js
All the interface with LevelDB is done on the Storer class.

## test/fixtures/quotes.js
This file includes an array of Satoshi Nakamoto quotes. We use it to generate sample block data.

## handlers/block.js
Configure the main block routes

## server.js
Configures the API entry point

## app.js
Starts the API server

## tamper.js
It's tampers the data so we can test the chain validation.