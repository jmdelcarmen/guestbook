'use strict';
var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
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

    usercollection.findOne({"username": username}, (e, user) => {
      if (user.username === username) {
        passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' });
        res.redirect('/guestbook');
      } else {
        res.redirect('/');
      }
  });
});


module.exports = router;
