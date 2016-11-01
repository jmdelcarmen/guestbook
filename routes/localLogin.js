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
      if (user.length > 0) {
        bcrypt.compare(password, user[0].password, (err, isValid) => {
          if (isValid) {
            console.log('Valid user');
            res.redirect('/guestbook');
          } else {
            console.log('Invalid user');
            res.redirect('/');
          }
        });
      } else {
        res.redirect('/');
      }
    });










  });


module.exports = router;
