const express = require('express');
const router = express.Router();
const userManager = require('../managers/othelloManager')

router.get('/generando', (req, res) => {
    userManager.testing("hola")    
});


module.exports = router;