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
let picUpload = upload.fields([{name:'pic', maxCount:10}]);

router
  .get('/', isLoggedIn, (req, res, next) => {
    User.findById(req.session.passport.user, 'userId', (err, doc) => {
      Album.find({userId : doc.userId}, 'name desc counter albumId cover')
        .then((doc) => {

         res.render('../commons/album_list', {albums:doc})
        })
    });

  })
  .get('/:id', isLoggedIn, (req, res, next) => {
    let dataAlbum = {
      userName : '',
      userPhoto : '',
      albumName : '',
      albumDesc : '',
      albumCounter : '',
      albumCover : ''
    };
    User.findById(req.session.passport.user)
      .then((user) => {
        dataAlbum.userName = user.name;
        dataAlbum.userPhoto = user.photo;
        Album.findOne({albumId : req.params.id})
          .then((album) => {
            dataAlbum.albumName = album.name;
            dataAlbum.albumDesc = album.desc;
            dataAlbum.albumCounter = album.counter;
            dataAlbum.albumCover = album.cover;
            dataAlbum.albumId = album.albumId;
            res.render('album', dataAlbum);
          })
    });

  })
  .get('/edit/:id', isLoggedIn, (req,res, next) => {
    Album.findOne({albumId:req.params.id}, 'name desc cover albumId')
      .then((doc) => {
      Photo.findOne({photoId:doc.cover}, 'filename')
        .then((filename) => {
          let response = {};
          response.name = doc.name;
          response.desc = doc.desc;
          response.albumId = doc.albumId;
          response.cover = doc.cover;
          response.filename = filename.filename;
          console.log(response);
          return res.json(response);
        });

      })
  })
  .post('/preloadimg', isLoggedIn, cpUpload, (req, res, next) => {
    let imgSrc = {};
    console.log(req.files);
    if (req.files) {
      // TODO !!! need files validation
      if (req.files.cover) {
        fs.renameSync(req.files.cover[0].path, '../public/temp/' + req.files.cover[0].filename);
        imgSrc.cover = '/temp/' + req.files.cover[0].filename;
        imgSrc.filename = req.files.cover[0].filename;
      }
    }
    res.json(imgSrc);
  })
  .post('/preloadpic', isLoggedIn, picUpload, (req, res, next) => {
    console.log(req.files);
    let imgSrc = [];
    if (req.files.pic) {
      req.files.pic.forEach((pic) => {
        fs.renameSync(pic.path, '../public/temp/' + pic.filename);
        imgSrc.push({path: '/temp/' + pic.filename, filename: pic.filename});
      });
      res.render('../modal-windows/add-photo.pug',{obj:imgSrc});
    }
  })
  .post('/', isLoggedIn, (req, res, next) => {
    // TODO need data validation
    let newAlbum = {};

    User.findById(req.session.passport.user, 'userId', (err, doc) => {
      newAlbum.userId = doc.userId;
      newAlbum.name = req.body.name;
      newAlbum.desc = req.body.desc;
      newAlbum.counter = 0;
      // newAlbum.cover = albumDir + '/' + req.body.filename;
      let album = new Album(newAlbum);
      album.save((err) => {
        if (err) return next(err);
        let albumDir = albumsDir + '/' + album.albumId;
        fs.mkdirSync(albumDir);
        fs.renameSync(__dirname + '/../public' + req.body.cover, albumDir + '/' + req.body.filename);
        let newPhoto = {};
        newPhoto.name = album.name;
        newPhoto.desc = album.desc;
        newPhoto.filename = req.body.filename;
        newPhoto.albumId = album.albumId;
        newPhoto.commets = [];
        newPhoto.likes = 0;
        let photo = new Photo(newPhoto);
        photo.save((err) => {
          if (err) next(err);
          album.cover = photo.photoId;
          album.counter = album.counter + 1;
          album.save((err) => {
            if (err) next(err);
            res.json({status: 'ok'})
          })
        });
      });
    });
  })
  .post('/:id', isLoggedIn, (req, res, next) => {
    console.log(req.body);
    User.findById(req.session.passport.user, 'userId')
      .then((user) => {
        Album.findOne({albumId:req.body.albumId})
          .then((album) => {
          if (user.userId === album.userId) {
            let albumDir = albumsDir + '/' + album.albumId;

            album.name = req.body.name;
            album.desc = req.body.desc;
            if (req.body.filename) {
              Photo.where({filename: req.body.filename_old}).findOneAndRemove((err) => {
                console.log(err);
                fs.unlink(albumDir + '/' + req.body.filename_old);
              });

              fs.renameSync(__dirname + '/../public/temp/' + req.body.filename, albumDir + '/' + req.body.filename);
              let newPhoto = {};
              newPhoto.name = album.name;
              newPhoto.desc = album.desc;
              newPhoto.filename = req.body.filename;
              newPhoto.albumId = album.albumId;
              let photo = new Photo(newPhoto);
              photo.save((err) => {
                if (err) next(err);
                album.cover = photo.photoId;
                album.save((err) => {
                  if (err) next(err);
                  return res.json({status: 'ok'})
                })
              });
            } else {
              album.save();
              res.end();
            }
          }
          })
      })

  });

module.exports = router;