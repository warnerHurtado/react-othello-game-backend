const express = require('express');
const router = express.Router();
const firebase = require('firebase-admin')
const status = require('http-status');
const serviceAccount = require('../othello-game-2c179-firebase-adminsdk-xbgg6-2318d0fd23.json');




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


    const createdAt = req.query.createdAt; 
    
    try{

        var db = firebase.firestore();

        db.collection('games').add({
            boardGame: boardGenerator(),
            xPlay: true,
            player1: createdAt,
            currentPlayer: createdAt,
            player2: null

    }).then(response => {
        res.status(status.OK).json({ idGame: response.id });
    }).catch(err => {
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    });
    
    }catch( err ){
        res.status( status.INTERNAL_SERVER_ERROR ).json({ error: err });
    }


});




router.get('/getPlayerGames', (req, res) => {

    const playerId = req.query.playerId;

    try{

        var pool = firebase.firestore();
        
        pool.collection('games').where( "player1", "==", playerId )
            .get()
                .then( (querySnapshot) => {

                    var playerGames = []
                    
                    querySnapshot.forEach( (doc) => {
                        playerGames.push( { idGame: doc.id, game: doc.data() } );
                    });

                    res.status( status.OK ).json( { games: playerGames } );
                    
                }).catch( err => res.status( status.INTERNAL_SERVER_ERROR ).json( { error: err } ) )

    }catch( err ){
        res.send( status.INTERNAL_SERVER_ERROR).json({ error: err }) 
    }
});




router.post('/addPlayer', async (req, res) => {

    const idGame    = req.body.idGame;
    const ndPlayer  = req.body.ndPlayer;


    try{
        var pool = firebase.firestore();

        await pool.collection('games').doc( idGame ).update({
            player2 : ndPlayer
        
        }).then( () => {
            res.status( status.OK ).json( { success: 200 } ); 
        }).catch( () => {
            res.status( status.INTERNAL_SERVER_ERROR ).json({ success: 500 });
        })

    }catch( err ){
        res.status( status.INTERNAL_SERVER_ERROR ).json({ error: err });
    }
});


router.post('/editGame', async (req, res) =>{

    const idGame = req.body.params.idGame;
    const boardGame =  req.body.params.boardGame;
    const position =  req.body.params.clickedPosition;
    const xPlay = req.body.params.xPlay;
    
    console.log(boardGame, position, xPlay, idGame)

    let modifiedBoard = flipSquares(boardGame, position, xPlay);

    if ( modifiedBoard !== null ) {

        try {

            var pool = firebase.firestore();
            await pool.collection('games').doc(idGame).update({
                boardGame: modifiedBoard,
                xPlay: !xPlay


            }).then(() => {
                res.status(200).json({ success: 200 });
            }).catch(() => {
                res.status(500).json({ error: err });
            })

        } catch (err) {
            res.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
        }

    } else {
        res.status(500).json({ success: 500 })
    }

});


router.get('/getGame', async (req, res) => {

    try {
        var db = firebase.firestore();
        const idGame = req.query.idGame;

        if (idGame) {
            const gameRef = db.collection('games').doc(idGame);
            const docGame = await gameRef.get();

            console.log('Pafdasdasasd')

            if (docGame.data()) {
                res.status(status.OK).json({ game: docGame.data() });
            } else {
                res.status(status.INTERNAL_SERVER_ERROR).json({ err: 'Este id del juego es inválido' })
            }
        } else {
            res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'No se ha enviado el id del juego' })
        }
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
});



function flipSquares(squares, position, xIsNext) {
    let modifiedBoard = null;
    
    let [startX, startY] = [position % 8, (position - position % 8) / 8];

    if (squares[position] !== null) {
        return null;
    }

    
    calculateOffsets(8).forEach((offset) => {
        let flippedSquares = modifiedBoard ? modifiedBoard.slice() : squares.slice();
        let atLeastOneMarkIsFlipped = false;
        let [lastXpos, lastYPos] = [startX, startY];

        for (let y = position + offset; y < 64; y = y + offset) {

            let [xPos, yPos] = [y % 8, (y - y % 8) / 8];

            if (Math.abs(lastXpos - xPos) > 1 || Math.abs(lastYPos - yPos) > 1) {
                break;
            }

            if (flippedSquares[y] === (!xIsNext ? 'X' : 'O')) {
                flippedSquares[y] = xIsNext ? 'X' : 'O';
                atLeastOneMarkIsFlipped = true;
                [lastXpos, lastYPos] = [xPos, yPos];
                continue;
            }


            else if ((flippedSquares[y] === (xIsNext ? 'X' : 'O')) && atLeastOneMarkIsFlipped) {
                flippedSquares[position] = xIsNext ? 'X' : 'O';
                modifiedBoard = flippedSquares.slice();
            }
            break;
        }
    });

    return modifiedBoard;
}


function calculateOffsets( index ) {
    return [1, -1].concat(index - 1).concat(index).concat(index + 1).concat(-index - 1).concat(-index).concat(-index + 1)
}



module.exports = router;