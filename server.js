const app = require('./app');

const http = require('http');

const port = process.env.PORT || 4000;
const hostname = process.env.HOST || 'localhost';


const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});