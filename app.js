require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();

const userRouter = require('./controllers/userController');



 
app.use(morgan('dev'));//?
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());//?
app.use(express.static(path.join(__dirname, 'public')));//?

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use('/user', userRouter);

   
 


module.exports = app;