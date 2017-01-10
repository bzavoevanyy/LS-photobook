'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

let userSchema = new Schema({
  name : String,
  email : String,
  password : String,
  socials : {
    facebook : String,
    google : String,
    twitter : String,
    vk : String
  },
  settings : {
    photo : String,
    backimg : String,
    about : String
  }
});
userSchema.plugin(autoIncrement.plugin, {model : 'User', field: 'userId'});

let User = mongoose.model('User', userSchema);


module.exports = User;