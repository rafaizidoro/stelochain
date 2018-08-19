## Running the code

A main.js file is included, which has an inital set of testing data.
The file is self explanatory, with appropriates comments on place.

To run the file, execute the following command:

```
  node main.js
```

The main.js file tampers the chain, so it will only be valid on the first run.

If you want to reset the test, you must remove the chaindata LevelDB directory:

```
 rm -rf ./chaindata
```

## File structure

The following files are used on the execise:

# chain.js
This files includes the main Blockchain and Block classes. It is responsible to set those classes and do all the validations.

# quotes.js
This files includes an array of Satoshi Nakamoto quotes. We use it to generate sample block data.

# storer.js
All the interface with LevelDB is done on the Storer class.