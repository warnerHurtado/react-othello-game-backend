const express = require('express');
const router = express.Router();
const userManager = require('../managers/othelloManager')

router.post('/test', (req, res) => {
    userManager.testing() 
    res.send(200)
});



module.exports = router;