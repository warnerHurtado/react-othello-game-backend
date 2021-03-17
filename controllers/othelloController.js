const express = require('express');
const router = express.Router();
const firebase = require('firebase-admin')
const status = require('http-status');
const serviceAccount = require('../othello-game-2c179-firebase-adminsdk-xbgg6-a9d71ab2a9');




firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://othello-game-2c179-default-rtdb.firebaseio.com/'
});


var db = firebase.firestore();





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



router.get('/newGame', (req, res) => {
    db.collection('games').add({
        boardGame: boardGenerator(),
        xPlay: true
    }).then(response => {
        res.status(status.OK).json({ idGame: response.id });
    }).catch(err => {
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    })
});


router.get('/getGame', async (req, res) => {
    
    const idGame = req.query.idGame;
    if ( idGame ) {
        const gameRef = db.collection('games').doc(idGame);
        const docGame = await gameRef.get();
        if ( docGame ) {
            res.status(status.OK).json({ game: docGame.data() });
        } else {
            res.status(status.INTERNAL_SERVER_ERROR).status({ err: 'Este id del juego es inválido' })
        }
    } else {
        res.status(status.INTERNAL_SERVER_ERROR).status({ error: 'No se ha enviado el id del juego' })
    }
});



module.exports = router;