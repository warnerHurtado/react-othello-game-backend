const admin = require('firebase-admin');
const generateUniqueId = require('generate-unique-id');

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


exports.testing = async (req, res) => {

    console.log("Hola desde el deploy");
    // try {
    //     const db = admin.database();
    //     const idGame = idGenerator();
    //     const squareTest = [['X', null, null, null, null], ['X', null, null, null, null], ['X', null, null, null, null]]
    //     db.ref('games').push(
    //         {
    //             id: idGame,
    //             squares: flatten(squareTest),
    //             xPlayed: true
    //         }
    //     ).then(response => {
    //         console.log(response)
    //     })


    // } catch (e) {
    //     console.log(e)
    // }


}



