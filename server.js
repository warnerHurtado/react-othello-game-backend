const app = require('./app');
const admin = require('firebase-admin');
const serviceAccount = require('./othello-game-2c179-firebase-adminsdk-xbgg6-a9d71ab2a9');
const http = require('http');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://othello-game-2c179-default-rtdb.firebaseio.com/'
});


http.createServer(function (req, res) {
    res.end('Hello World\n');
  }).listen(3000);
  console.log('Server running at http://10.128.0.3:8080/');