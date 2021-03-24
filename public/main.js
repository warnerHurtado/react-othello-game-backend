var socket = io('http://localhost:4000', {transports: ['websocket', 'polling', 'flashsocket'], 'forceNew': true});






socket.emit( 'testing', socket => {
    socket.on('testing', data => {
        console.log(data)
    })
} );

// Jala la data
socket.on('message', (data) => {
    console.log( data )
})