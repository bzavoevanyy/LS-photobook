'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

let albumSchema = new Schema({
  name : String,
  desc : String,
  cover : String,
  userId : Number,
  counter : Number
});
albumSchema.plugin(autoIncrement.plugin, {model : 'Album', field: 'albumId'});

let Album = mongoose.model('Album', albumSchema);


module.exports = Album;