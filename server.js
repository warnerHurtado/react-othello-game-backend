const app = require('./app');
const admin = require('firebase-admin');
const serviceAccount = require('./othello-game-2c179-firebase-adminsdk-xbgg6-a9d71ab2a9');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://othello-game-2c179-default-rtdb.firebaseio.com/'
});




async function main() {
    await app.listen(3000);
    console.log('Server on port', 3000);
}

main();