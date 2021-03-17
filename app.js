const express = require('express');
const morgan = require('morgan');

const app = express();



app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// app.use((res, next) => {
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.header('Access-Control-Allow-Headers', 'Content-Type');
// });


//Importación de rutas
const othelloController = require('./controllers/othelloController');

// Rutas
app.get('/', (req, res) => {
    res.send(200)
})

app.use(othelloController );
   
module.exports = app;