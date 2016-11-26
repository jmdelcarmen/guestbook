'use strict';
const mongoose = require('mongoose');

const guestModel = function () {

  let guestSchema = mongoose.Schema({
    username: String,
    message: String,
    avatar: String,
    date: String
  });

  return mongoose.model('Guest', guestSchema);
}

module.exports = new guestModel();
