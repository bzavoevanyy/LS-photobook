/**
 * Created by bogdan on 17.01.17.
 */
'use strict';
let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('../models/User');
let crypto;
try {
  crypto = require('crypto');
} catch(err) {

}
const namePatttern = /^[a-z0-9_-]{3,16}$/;
const passwordPattern = /^[a-z0-9_-]{6,18}$/;
const emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

router
  .post('/' ,(req, res, next) => {
    "use strict";
    let newUser = {
      facebook: '',
      twitter: '',
      google: '',
      vk: '',
      about: '',
      photo: '/img/photo.jpg',
      backimg: '/img/backimg.jpg'
    };
    let message = [];
    if (req.body.hasOwnProperty('email') &&
        req.body.name &&
        typeof req.body.email == 'string' &&
        emailPattern.test(req.body.email)) {
      newUser.email = req.body.email;
      User.findOne({email: req.body.email}).then((doc) => {

        if (doc) message.push({message:'Такой пользователь уже существует!'});

        if (!(req.body.hasOwnProperty('name') &&
          req.body.name &&
          typeof req.body.name == 'string' &&
          namePatttern.test(req.body.name))) {
          message.push({message:'Имя должно быть от 3 до 16 символов и содержать только цифры и латинские буквы'});
        } else newUser.name = req.body.name;
        if (
          !(req.body.hasOwnProperty('password') &&
          req.body.password &&
          typeof req.body.password == 'string' &&
          passwordPattern.test(req.body.password))
        ) {
          message.push({message:'Пароль должно быть от 6 до 18 символов и содержать только цифры и латинские буквы'});
        } else newUser.password = crypto.createHmac('sha256',req.body.password).update('group-3').digest('hex');
      }
    ).then(() => {
        if (message.length > 0) {
          message.unshift({status : 400});
          return res.json(message);
        } else {
          let user = new User(newUser);
          user.save((err) => {
            if (err) return next(err);
            passport.authenticate('localUser', (err, user) => {
              if (err) {
                return next(err);
              }
              if (!user) {
                return res.json({status: 'Укажите логин и пароль!'}); //TODO need correction
              }
              req.logIn(user, function (err) {
                if (err) {
                  return next(err);
                }
                return res.json([{status : 200, rediect : '/home'}]);
              });
            })(req, res, next);

          })
        }
      })
    }
  });


module.exports = router;
