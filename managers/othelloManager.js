const admin = require('firebase-admin');
const serviceAccount = require('../othello-game-2c179-firebase-adminsdk-xbgg6-a9d71ab2a9');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://othello-game-2c179-default-rtdb.firebaseio.com/'
});

const db = admin.database();


exports.testing = async (req) => {
    console.log(req)
    db.ref('probando').once('value', (snapshot) => {
        data = snapshot.val();

        console.log(data)
    })
    //db.ref('probando').push({ name: 'Warner', last: 'Hurtado' });
}



