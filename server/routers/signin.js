/**
 * Created by bogdan on 17.01.17.
 */
'use strict';
let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('../models/User');

const emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const passwordPattern = /^[a-z0-9_-]{6,18}$/;

router
  .post('/', (req, res, next) => {
    let message = [];
    if (req.body.hasOwnProperty('email') &&
      req.body.name &&
      typeof req.body.email == 'string' &&
      emailPattern.test(req.body.email)) {
      User.findOne({email: req.body.email}).then((doc) => {

          if (!doc) message.push({message:'Такой пользователь не найден. Зарегистрируйтесь.'});

          if (
            !(req.body.hasOwnProperty('password') &&
            req.body.password &&
            typeof req.body.password == 'string' &&
            passwordPattern.test(req.body.password))
          ) {
            message.push({message:'Пароль должно быть от 6 до 18 символов и содержать только цифры и латинские буквы'});
          }
        }
      ).then(() => {
        if (message.length > 0) {
          message.unshift({status : 400});
          return res.json(message);
        } else {
          passport.authenticate('localUser', (err, user) => {
            if (err) {
              return next(err);
            }
            if (!user) {
              return res.json([{status: 400}, {message:'Логин или пароль указаны не верно!'}]); //TODO need correction
            }
            req.logIn(user, function (err) {
              if (err) {
                return next(err);
              }
              return res.json([{status: 200, rediect: '/home'}]);
            });
          })(req, res, next);
        }
      })
    }
  });

module.exports = router;