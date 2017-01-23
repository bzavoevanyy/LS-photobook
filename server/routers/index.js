'use strict';
let express = require('express');
let router = express.Router();

router
  .get('/', (req, res, next) => {
      console.log("post event");
    res.render('index');
      console.log('test2');

  });

module.exports = router;