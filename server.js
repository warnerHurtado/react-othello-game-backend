const app = require('./app');

const http = require('http');

const port = process.env.PORT || 3000;
const hostname = process.env.HOST || 'localhost';


const server = http.createServer(app);

server.listen(port, () => {
    console.log(`El servidor se está ejecutando en el puerto http://${hostname}:${port}/`);
});