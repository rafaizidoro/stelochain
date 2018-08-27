const server = require('./server');

const start = async() => {
    try {
        await server.start();
    } catch (e) {
        console.log(e);
        process.exit(1);
    }

    console.log(`Server running at ${server.info.uri}`);
}

start();