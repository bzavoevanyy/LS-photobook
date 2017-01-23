'use strict';
let express = require('express');
let router = express.Router();
let passport = require('passport');
let isLoggedIn = require('../utils/isLoggedIn');
let User = require('../models/User');
let Album = require('../models/Album');
let Photo = require('../models/Photo');
let multer = require('multer');
let upload = multer({dest: '../uploads/'});
let fs = require('fs');
let path = require('path');
let albumsDir = path.join(__dirname + '/../albums');
fs.existsSync(albumsDir) || fs.mkdirSync(albumsDir);
let cpUpload = upload.fields([{name: 'cover', maxCount: 1}]);

router
  .get('/album/:id', isLoggedIn, (req, res, next) => {
    Photo.find({albumId : req.params.id})
      .then((photos) => {
        res.render('../commons/photo_list', {obj:photos})
      })
  })
  .get('/:id', isLoggedIn,(req, res, next) => {
    Photo.findOne({photoId: req.params.id}, 'filename albumId')
      .then((doc) => {
        if (doc) {
          return res.sendFile(path.resolve(__dirname + '/../albums/' + doc.albumId + '/' + doc.filename));
        } else {
          // TODO need error handle
          return res.send('err');
        }
      });
  })
  .get('/', isLoggedIn,(req, res, next) => {
    let photoData = {
      name: '',
      desc: '',
      albumId: '',
      tags: '',
      likes: '',
      comments: '',
      photoId: '',
      userPhoto: '',
      albumName: ''
    };

    Photo.find({}, 'name desc albumId tags likes photoId comments')
      .then((photos) => {
        let renderData = [];
        photos.forEach((photo) => {
          Album.findOne({albumId: photo.albumId}, 'name userId', (err, album) => {
            photoData.albumName = album.name;
            User.findOne({userId: album.userId}, 'photo', (err, user) => {
              photoData.userPhoto = user.photo;
              renderData.push({name:photo.name, desc:photo.name, albumId : photo.albumId, tags: photo.tags, likes:photo.likes, comments:photo.comments, photoId:photo.photoId});
              if (renderData.length == photos.length) {
                console.log(renderData);
                res.render('../commons/album-list_main', {obj: renderData});
              }
            })
          })
        });
      })
  })
  .post('/', isLoggedIn, (req, res, next) => {
    Album.findOne({albumId:req.body.albumId})
      .then((album) => {

        let newPhoto = {};
        let albumDir = albumsDir + '/' + album.albumId;
          req.body.filename.forEach((file) => {
            fs.renameSync(__dirname + '/../public/temp/' + file, albumDir + '/' + file);
            newPhoto.name = album.name;
            newPhoto.desc = album.desc;
            newPhoto.filename = file;
            newPhoto.albumId = album.albumId;
            newPhoto.commets = [];
            newPhoto.likes = 0;
            let photo = new Photo(newPhoto);
            photo.save((err) => {
              if (err) next(err);
            })
          });
        res.send('ok');
      })
  });

module.exports = router;