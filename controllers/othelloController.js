const express = require('express');
const router = express.Router();
const firebase = require('firebase-admin')
const status = require('http-status');
const serviceAccount = require('../othello-game-2c179-firebase-adminsdk-xbgg6-a9d71ab2a9');




firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://othello-game-2c179-default-rtdb.firebaseio.com/'
});







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

    var db = firebase.firestore();

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

    try {
        var db = firebase.firestore();
        const idGame = req.query.idGame;

        if (idGame) {
            const gameRef = db.collection('games').doc(idGame);
            const docGame = await gameRef.get();
            if (docGame) {
                res.status(status.OK).json({ game: docGame.data() });
            } else {
                res.status(status.INTERNAL_SERVER_ERROR).status({ err: 'Este id del juego es inválido' })
            }
        } else {
            res.status(status.INTERNAL_SERVER_ERROR).status({ error: 'No se ha enviado el id del juego' })
        }
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
});


router.put('/editGame', async (req, res) => {

    const idGame = req.body.idGame;
    const boardGame = req.body.boardGame;
    const xPlay = req.body.xPlay;

    try {
        var db = firebase.firestore();
        db.collection('games').doc(idGame).update({
            boardGame: JSON.parse(boardGame),
            xPlay: JSON.parse(xPlay.toLowerCase())
        }).then(response => {
            res.status(status.OK).json({ res: response });
        }).catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).json({ error: err })
        });
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: err })
    }


})


module.exports = router;