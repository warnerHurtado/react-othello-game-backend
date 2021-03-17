const firebase = require('firebase-admin');
const generateUniqueId = require('generate-unique-id');

const serviceAccount = require('../othello-game-2c179-firebase-adminsdk-xbgg6-a9d71ab2a9');



// firebase.initializeApp({
//     apiKey: "AIzaSyCc3khGvfrzHJLz-ZRj7hY2esYZSwEUoLc",
//     authDomain: "othello-game-2c179.firebaseapp.com",
//     databaseURL: "https://othello-game-2c179-default-rtdb.firebaseio.com",
//     projectId: "othello-game-2c179",
//     storageBucket: "othello-game-2c179.appspot.com",
//     messagingSenderId: "48625112515",
//     appId: "1:48625112515:web:35b9eb23c652417f4a9976",
//     measurementId: "G-VSL5J3DJXB"
// })

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://othello-game-2c179-default-rtdb.firebaseio.com/'
});





var db = firebase.firestore();


const idGenerator = () => {
    return generateUniqueId({
        length: 10,
        useLetters: true,
        useNumbers: true
    })
}





// db.ref('probando').once('value', ( snapshot ) => {
//     data = snapshot.val();
//     console.log(data)
// });


function flatten(board) {
    return board.reduce((results, row) => {
        return results.concat(row)
    }, [])
}
function boardGenerator() {
    const boardMatrix = Array(8).fill(null).map(() => Array(8).fill(null))
    boardMatrix[3][3] = 'X'
    boardMatrix[3][4] = 'O'
    boardMatrix[4][4] = 'X'
    boardMatrix[4][3] = 'O'
    return flatten(boardMatrix);
}



exports.newGame = async (req, res) => {

    await db.collection('games').add({
        boardGame: boardGenerator(),
        xPlay: true
    
    }).then( response => {
        console.log(response.id)
        return response.id;
    }).catch( err => {
        return err
    })
}

exports.getGameData = async( req ) => {
    // Aquí se va hacer el get del documento
}



