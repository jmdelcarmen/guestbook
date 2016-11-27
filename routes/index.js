'use strict';
const express = require('express');
const router = express.Router();
const env = require('../app').env;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//file upload
const multer = require('multer');
const upload = multer({dest: 'public/uploads'});

////////////////////////HOME PAGE//////////////////////////
router.route('/').get((req, res) => {
  res.render('index', {user: req.user});
}).post((req, res) => {
//Home page post///
});

/////////////////////////Local_Sinup/////////////////////////////

router.route("/local_signup")
  .get((req, res) => {
    res.render('localauth/local_signup');
  })
  .post((req, res) => {
    console.log(req.body);
    console.log(req.file);
    let picture = '';
    req.file ? picture = `/uploads/${req.file.filename}` : picture = 'https://s-media-cache-ak0.pinimg.com/originals/7d/da/38/7dda385ed3724fea700d45a0349d9e77.png'
    let newUser = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      email: req.body.email,
      picture: picture,
      date_created: new Date().toDateString()
    });
    newUser.save((e, data) => {
      if(e) throw e;
      console.log('successfully registered the user');
      console.log(newUser);
    });
    res.redirect('/');
  });


/////////////////////////Local_Login/////////////////////////////

router.route('/local_login')
  .get((req, res) => {
    res.render('localauth/local_login');
  })
  .post(passport.authenticate('local', {failureRedirect: '/local_login'}), (req, res) => {
    // req.flash('success', 'You are now logged in');
    res.redirect('/guestbook');
  });

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    (username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));


/////////////////////////Auth0-Login&Register/////////////////////
router.get('/auth0_login', (req, res) => {
    res.render('auth0', { env: env });
  });

router.get('/callback', passport.authenticate('auth0', { failureRedirect: '/' }), (req, res) => {
    res.redirect(req.session.returnTo || '/guestbook');
  });


module.exports = router;
