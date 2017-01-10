'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

let photoSchema = new Schema({
  name : String,
  desc : String,
  albumId : Number,
  comments : Array,
  tags : Array,
  likes : Number
});
photoSchema.plugin(autoIncrement.plugin, {model : 'Photo', field: 'photoId'});

let Photo = mongoose.model('Photo', photoSchema);


module.exports = Photo;