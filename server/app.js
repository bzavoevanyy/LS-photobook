'use strict';
let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser'); // Для парсинга кук
let bodyParser = require('body-parser');
let passport = require('passport'); // сам passport js
let LocalStrategy = require('passport-local').Strategy; // Локальная стратегия, пользователь хранится в базе
let mongoose = require('mongoose');
let session = require('express-session'); // Для работы сессий
let MongoStore = require('connect-mongo')(session); // Хранение сессий в MongoDb
let User = require('./models/User');
let app = express();
let signup = require('./routers/signup');
let signin = require('./routers/signin');
let home = require('./routers/home');
let crypto;
try {
  crypto = require('crypto');
} catch (err) {

}
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test2');

// Следующие два метода подготовки данных при чтении и записи в MongoStore
passport.serializeUser(function (user, done) {
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id).then((user) => {
    done(null, user);
  })
});

// Сама локальная стратегия - ищет пользователя в базе и проверяет его пароль
passport.use('localUser', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (username, password, done) => {
  User.findOne({"email": username}).then((user) => {

    if (username === user.email && crypto.createHmac('sha256', password).update('group-3').digest('hex') === user.password) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser()); // подключаем парсер кук

app.use(express.static(path.join(__dirname, 'public')));

// устанавливаем параметры сессии - настрои позже
app.use(session({
  secret: 'ms Aria',
  key: 'keys',
  cookie: {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 60 * 1000 * 24
  },
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
// иницилизируем модуль сессий и passport js
app.use(passport.initialize());
app.use(passport.session());

// Routers

app.use('/signup', signup);
app.use('/signin', signin);
app.use('/home', home);

// следующий маршрут удаляет сессию
app.get('/del', (req, res) => {
  req.session.destroy();
  res.json({status: 'Сессия удалена'});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error', {message: err.message});
});

module.exports = app;
