const Server = require('./server');

const start = async() => {
    let server = new Server();

    try {
        await server.start();
    } catch (e) {
        console.log(e);
        process.exit(1);
    }

}

start();