const express = require('express');
const morgan = require('morgan');

const app = express();



app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// app.use((res, next) => {
//     res.append('Access-Control-Allow-Origin', '*');
//     res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.append('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });


//Importación de rutas
const othelloController = require('./controllers/othelloController');

// Rutas
app.use( othelloController );
   
module.exports = app;