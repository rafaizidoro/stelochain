## Installation
After cloning this project, you will need to install the npm modules:

```
    npm install
```

## Starting the API Server
To start the API server (Hapi), you will need to run the following command:
```
 node app.js
```

This will open the server on port 8000 and will synchronize the blockchain.

The following endpoint are available:

### POST /block
This endpoint allows the client to create a block. Is receives a JSON with the following schema:

```
 { "body" : "Satoshi is Alive" }
```


### GET /block/0
This endpoint allows the client to request a block. It returns a JSON schema with the block data:

```
{
    "hash": "d4ba3a0c51ef0aea18be19d6c3f1349390488e8a92e721f63f45c8a964cfeaac",
    "height": 0,
    "body": "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks",
    "time": "1535420182",
    "previousBlockHash": ""
}
```

## Running tests
The test were created using the Jest framework. To run the tests just execute:

```
 npm tests
```
** The tests will works only on *nix based systems **

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
