'use strict';
let express = require('express');
let router = express.Router();
let passport = require('passport');
let isLoggedIn = require('../utils/isLoggedIn');
let User = require('../models/User');
let multer = require('multer');
let upload = multer({dest: '../uploads/'});
let fs = require('fs');
let path = require('path');
let usersDir = path.join(__dirname + '/../public/users_photo');
fs.existsSync(usersDir) || fs.mkdirSync(usersDir);
const namePatttern = /^[a-z0-9_-]{3,16}$/;
let cpUpload = upload.fields([{name: 'photo', maxCount: 1}, {name: 'backimg', maxCount: 1}]);
router
  .get('/', isLoggedIn, (req, res, next) => {
    let userId = req.session.passport.user;
    User.findById(userId, 'userId name email facebook twitter google vk photo backimg',(err, doc) => {
      if (err) return next(err);
      // TODO make object for render template
      console.log(doc);
      res.render('photo_main', doc);
    });

  })
  .post('/preloadimg', isLoggedIn, cpUpload, (req, res, next) => {
    let imgSrc = {};
    if (req.files) {
      // TODO !!! need files validation
      if (req.files.photo) {
        fs.renameSync(req.files.photo[0].path, '../public/temp/' + req.files.photo[0].filename);
        imgSrc.photo = '/temp/' + req.files.photo[0].filename;
      }
      if (req.files.backimg) {
        fs.renameSync(req.files.backimg[0].path, '../public/temp/' + req.files.backimg[0].filename);
        imgSrc.backimg = '/temp/' + req.files.backimg[0].filename;
      }
    }
    return res.json(imgSrc);
  })
  .post('/edit', isLoggedIn, (req, res, next) => {
    let query = User.findById(req.session.passport.user);
    query.select('userId');
    User.findById(req.session.passport.user, 'name facebook twitter google vk about photo backimg', (err, updateUser) => {
      for (let key in updateUser) {

        if (
          req.body[key] &&
          typeof req.body[key] === 'string'
        ) {
          if (key === 'name') {
            if (namePatttern.test(req.body[key])) updateUser.name = req.body.name;
          }
          if (key === 'facebook' || key === 'twitter' || key === 'google' || key === 'vk') {
            updateUser[key] = req.body[key]; //TODO validate social links
          }
          if (key === 'about') updateUser.about = req.body.about; // TODO validate text 'about'

          let query = User.findById(req.session.passport.user);
          let userDir;
          query.select('userId');
          query.exec((err, user) => {
            // TODO error handler
            if (key === 'photo' || key === 'backimg') {
              userDir = usersDir + '/' + user.userId;
              fs.existsSync(userDir) || fs.mkdirSync(userDir);
              fs.renameSync(path.join(__dirname, '../public' + req.body[key]), userDir + '/' + key + '.jpg'); // TODO chek type of file
              updateUser[key] = '/users_photo/' + user.userId + '/' + key + '.jpg'; // TODO chek type of file
            }
            User.findOneAndUpdate({_id: req.session.passport.user}, {$set: updateUser}).exec();
            res.end('ok'); // TODO send message
          });
        }
      }
    });


  });

module.exports = router;