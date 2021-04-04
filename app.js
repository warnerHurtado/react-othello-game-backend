const express = require('express');
const morgan = require('morgan');

const app = express();



app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
      );    
    res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
    next();
});

//Importación de rutas
const othelloController = require('./controllers/othelloController');

// Rutas
app.get('/', (req, res) => {
    res.send('Backend is up')
})


app.use(othelloController);

module.exports = app;