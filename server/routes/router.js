'use strict';

let express = require('express');
// get an instance of the express Router
let router = express.Router();


// test route api get method

router.get('/singup' ,function(req, res) {
    res.send('test');
});

module.exports = router;
