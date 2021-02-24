const express = require('express');
const router = express.Router();
const userManager = require('../managers/userManager')

router.post('/createUser', (req, res, next) => {
    try {
        userManager.createUser(req.body).then(
            (data) => {
                let response = {
                    content: data.recordset,
                    success: data.output,
                    code: 200
                };
                res.send(JSON.stringify(response));
            }
        );
    }
    
    catch (err) {
        let response = {
            content: err,
            code: 500
        };
        res.send(JSON.stringify(response));
    }
  });

module.exports = router;