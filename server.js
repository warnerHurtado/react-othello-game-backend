const app = require('./app');
const firebase = require('firebase-admin')

// // firebase.initializeApp({
// //     credential: firebase.credential.cert(serviceAccount),
// //     databaseURL: 'https://othello-game-2c179-default-rtdb.firebaseio.com/'
// // });





function main() {
    app.listen(3000)
    console.log('Server running on localhost:3000')
}

main()