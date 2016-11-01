'use strict';

var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();


router.route('/')
  .get((req, res) => {
      res.render('signup');
  })
  .post((req, res) => {
    ////////parse form content///////
    var username = req.body.username;
    var password = req.body.password;

    var db = req.db;
    //create localUsers collection in guestbook database//
    var usercollection = db.get('usercollection');

    //crate user
    usercollection.find({"username": username}, (e, user) => {
        if (user.length === 0) {
          ///////////////encrypt the password///////////////
          var hashedPwd = bcrypt.hashSync(password, 10);

          usercollection.insert({"username": username, "password": hashedPwd});
          res.redirect('/localLogin');
        } else {
          res.redirect('/');
        }
    });
  });


module.exports = router;
