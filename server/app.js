'use strict';

let express = require('express');
let http = require('http');
let path = require('path');
let passport = require('passport');
let bodyParser = require('body-parser');

let app = express();
let router = require('./routes/router');


app.set('port', 8080);
app.use('/api', router);

// server start lisener
http.createServer(app).listen(app.get('port'), () => {
    console.log('express server listener on port ' + app.get('port'));
});

//Middleware
//app.use((req, res, next) => {
//   if (req.url == '/') {
//       res.end('Hello home page')
//   } else {
//       next();
//   }
//});