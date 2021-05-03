const express = require('express');
const router = express.Router();
const status = require('http-status');

const firebase = require('firebase-admin')
const serviceAccount = require('../othello-game-2c179-firebase-adminsdk-xbgg6-2318d0fd23.json');
const { response } = require('express');

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




function calculateOffsets(index) {
    return [1, -1].concat(index - 1).concat(index).concat(index + 1).concat(-index - 1).concat(-index).concat(-index + 1)
}


function calculateScore(board) {

    var player1Points = 0;
    var player2Points = 0;
    var total = 0;

    board.forEach(item => {
        if (item) {
            item == 'X' ? player1Points++ : player2Points++
            console.log(item)
        }
    });

    gameScore = {
        player1: player1Points,
        player2: player2Points
    };

    total = player1Points + player2Points;

    return { gameScore, total };

}

async function saveInformation(uid, email, displayName) {

    try {

        var pool = firebase.firestore();
        await pool.collection('registeredUsers').add({
            uid: uid,
            email: email,
            displayName: displayName
        }).then(() => console.log('se hizo'))
            .catch(() => console.log('nel'))

    } catch {
        return false;
    }
}

async function getPlayerInfo(uid) {

    var user;

    try {
        var pool = firebase.firestore();
        await pool.collection('registeredUsers').where('uid', "==", uid).
            get().then(snapshot => {
                snapshot.forEach(async doc => {
                    user = await doc.data()

                })
            });

        return user;
    } catch (err) {
        return undefined;
    }
}



router.get('/newGame', async (req, res) => {
    try {

        const { uid, displayName } = await getPlayerInfo(req.query.createdBy)

        var db = firebase.firestore();

        db.collection('games').add({
            boardGame: boardGenerator(),
            xPlay: true,
            currentPlayer: uid,
            createdAt: Date.now(),
            player1: {
                playerId: uid,
                playerName: displayName
            },
            player2: {
                playerId: null,
                playerName: null
            },
            score: { player1: 2, player2: 2 },
            endedGame: false

        }).then(response => {
            res.status(status.OK).json({ idGame: response.id });
        }).catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).json(err);
        });

    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(err);
    }

});

router.post('/createRoom', async (req, res) => {

    const owner = req.body.owner;
    const idOwner = req.body.idOwner;

    try {
        var db = firebase.firestore();

        db.collection('rooms').add({

            owner:{
                owner,
                idOwner
            },
            players: [
                idOwner
            ],
            games: []

        }).then( response => {
            res.status(status.OK).json({idRoom: response.id});
        }).catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).json(err);
        });

    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json(err);
    }
});

router.post('/editRoom', async (req, res) => {

})

router.post('/savePlayerInformation', async (req, res) => {

    const uid = req.body.params.uid;
    const displayName = req.body.params.displayName;
    const email = req.body.params.email;

    try {

        var pool = firebase.firestore();
        var alreadyExist = true;

        await pool.collection('registeredUsers')
            .get()
            .then(snapshot => {
                snapshot.forEach(async doc => {
                    if ( await doc.data().uid === uid) {
                        alreadyExist = false;
                    }
                });
            });

        if (alreadyExist) {
            await saveInformation(uid, email, displayName);
        }

        res.status(status.OK).json({ success: 200 })

    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
});



router.get('/getPlayerGames', async (req, res) => {

    const playerId = req.query.playerId;

    try {

        var pool = firebase.firestore();
        const response = await pool.collection('games').get();

        var playerGames = [];
        response.forEach(doc => {

            if (doc.data().player1.playerId === playerId || doc.data().player2.playerId === playerId) {
                playerGames.push(doc.id);
            }
        });

        res.status(status.OK).json({ games: playerGames })

    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: err })
    }
});


router.post('/addPlayer', async (req, res) => {

    const idGame = req.body.params.idGame;

    console.log(req.body.params.ndPlayer, 'Prueba');
    try {
        const { uid, displayName } = await getPlayerInfo(req.body.params.ndPlayer);

        var pool = firebase.firestore();
        await pool.collection('games').doc(idGame).update({

            player2: {
                playerId: uid,
                playerName: displayName
            }

        }).then(() => {
            res.status(status.OK).json({ success: 200 });
        }).catch(() => {
            res.status(status.INTERNAL_SERVER_ERROR).json({ success: 500 });
        })

    } catch (err) {

        res.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
});


router.post('/skipTurn', async (req, res) => {

    const idGame = req.body.params.idGame;
    const xPlay = req.body.params.xPlay;
    const currentPlayer = req.body.params.currentPlayer;

    try {

        var pool = firebase.firestore();
        await pool.collection('games').doc(idGame).update({
            xPlay: xPlay,
            currentPlayer: currentPlayer

        }).then(() => {
            res.status(status.OK).json({ success: 200 })

        }).catch((err) => {

            res.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
        })

    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
});

router.post('/editGame', async (req, res) => {

    const idGame = req.body.params.idGame;
    const boardGame = req.body.params.boardGame;
    const position = req.body.params.clickedPosition;
    const xPlay = req.body.params.xPlay;
    const currentPlayer = req.body.params.currentPlayer;

    let modifiedBoard = flipSquares(boardGame, position, xPlay);

    if (modifiedBoard !== null) {

        var endedGame = false;

        calculatedScore = calculateScore(modifiedBoard);

        if (calculatedScore.total === 64) endedGame = true;
        if (calculatedScore.gameScore.player2 === 0 || calculatedScore.gameScore.player1 === 0) endedGame = true;

        try {

            var pool = firebase.firestore();

            await pool.collection('games').doc(idGame).update({
                boardGame: modifiedBoard,
                xPlay: !xPlay,
                currentPlayer: currentPlayer,
                score: calculatedScore.gameScore,
                endedGame: endedGame
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

router.get('/getAllplayers', async (req, res) => {

    try {

        var pool = firebase.firestore();
        const usersRef = await pool.collection('registeredUsers');

        var users = []
        await usersRef.get().then((snapshot) => {

            snapshot.forEach((doc) => {
                users.push(doc.data());
            })
        });

        res.status(status.OK).json({ users: users });

    } catch {
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'Fail getting the players' });
    }
})





module.exports = router;