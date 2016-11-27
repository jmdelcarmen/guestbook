'use strict';
const mongoose = require('mongoose');

const userModel = function () {

  let userSchema = mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    email: {type: String, unique: true, required: true},
    picture: {type: String},
    date_created: {type: Date, default: Date.now}
  });

  return mongoose.model('User', userSchema);

}

module.exports = new userModel();
