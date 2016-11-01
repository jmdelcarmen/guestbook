'use strict';
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();



router.route('/')
  .get((req, res) => {
      res.render('localLogin');
  })
  .post((req, res) => {
    var db = req.db;
    var usercollection = db.get('usercollection');
    var username = req.body.username;
    var password = req.body.password;

    usercollection.find({"username": username}, (e, user) => {
      bcrypt.compare(password, user[0].password, (err, response) => {
        if (response) {
          console.log('I work');
          res.redirect('/guestbook');
        } else {
          console.log('I don\'t work. ');
          res.redirect('/');
        }
    });


    });
  });


module.exports = router;
