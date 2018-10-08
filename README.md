# Stelochain - A Star Notary Blockchain

This project is part of Udacity Blockchain Nanodegree program. It is a proof of concept of a simple blockchain.

## Prerequisites
You'll need Docker to install dependencies and run the server.

## Installation
After cloning this project, just type the following on you terminal:

```
  docker build -t stelochain .
```

## Starting the API Server
To start the NodeJS API Server(Hapi), you need to run the docker container:

```
  docker run -it -p 8888:8888 stelochain
```

It will open a server on port 8888 and will synchronize the blockchain.

## Authentication
To register a star, you first need to validate your Bitcoin address. To do that,
you will need to use the following endpoint:

### POST /requestValidation

```
 { "address": "your bitcoin address here" }
```

This endpoint will response with a message. With that message in hands, you will need to sign it using you preferred Bitcoin wallet (e.g Electrum) and do another request to the following endpoint:

### POST /validate

```
  {
      "address": "your bitcoin address here",
      "signature": "the signature output from your bitcoin client"
  }
```

After a succesful verification, you will register your star at the endpoint:

### POST /block

```
 {
  "address": "your bitcoin address here",
  "star": {
    "dec": "-26° 29' 25.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
 }
```

* Note that after the authentication, you'll have a validation window, which is the time remaining to register your star. If you don't register on time, you will need to restart
the authentication flow again.
* You are only abre to register **ONE** star per authentication.

## Block Explorer

There are three search endpoints to explore the blockchain:

### GET /block/{blockHeight}
This endpoint allows the client to request a block. It returns a JSON schema with the block data:

```
{
    "hash": "5f6563225ff600f737aa85034d43d401399d70eeccacffe4cd501a101ac1bf49",
    "height": 0,
    "body": {
        "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF",
        "star": {
            "ra": 0,
            "dec": 0,
            "storyDecoded": "The Times 00/00/00 The Big Bang just happened",
            "story": "5468652054696d65732030302f30302f303020546865204269672042616e67206a7573742068617070656e6564"
        }
    },
    "time": "1539000301",
    "previousBlockHash": ""
}
```

### GET /stars/address:{address}
You can search all stars registered from a specific address using this endpoint.
It returns a JSON with all the blocks from that address:

```
[
    {
        "hash": "5f6563225ff600f737aa85034d43d401399d70eeccacffe4cd501a101ac1bf49",
        "height": 0,
        "body": {
            "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF",
            "star": {
                "ra": 0,
                "dec": 0,
                "storyDecoded": "The Times 00/00/00 The Big Bang just happened",
                "story": "5468652054696d65732030302f30302f303020546865204269672042616e67206a7573742068617070656e6564"
            }
        },
        "time": "1539000301",
        "previousBlockHash": ""
    },
    {
        "body": {
            "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF",
            "star": {
                "dec": "-26° 29' 25.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "height": 1,
        "time": "1539000549",
        "previousBlockHash": "5f6563225ff600f737aa85034d43d401399d70eeccacffe4cd501a101ac1bf49",
        "hash": "8281a87d5f7a18f1f8c9bd5c4160eb4a829389b2533db65fd86162a01d65dea9"
    }
]
```
### GET /stars/hash:{hash}
You can search all stars registered from a specific hash using this endpoint.
It returns a JSON with all the blocks from that hash:

```
{
    "body": {
        "address": "1JcnVEyQXVJQHBd2sFn3bt4XREixb4CxPF",
        "star": {
            "dec": "-26° 29' 25.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "height": 1,
    "time": "1539000549",
    "previousBlockHash": "5f6563225ff600f737aa85034d43d401399d70eeccacffe4cd501a101ac1bf49",
    "hash": "8281a87d5f7a18f1f8c9bd5c4160eb4a829389b2533db65fd86162a01d65dea9"
}
```

## Running tests
The test were created using the Jest framework. To run the tests just execute:

```
 docker run -it stelochain 'npm tests'
```