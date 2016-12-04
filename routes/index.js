'use strict';

const env = require('./auth_config').env;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');

exports.landingPage = (req, res) => {
  res.render('index', {user: req.user});
}

//local_signup
exports.showLocalSignup = (req, res) => {
  res.render('localauth/local_signup');
}

exports.signupUser = (req, res) => {
  let picture = '';
  //check for fileupload
  req.file ? picture = `/uploads/${req.file.filename}` : picture = 'https://s-media-cache-ak0.pinimg.com/originals/7d/da/38/7dda385ed3724fea700d45a0349d9e77.png'
  let newUser = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    email: req.body.email,
    picture: picture,
    date_created: new Date().toDateString()
  });

  newUser.save((err, data) => {
    if(err) {
      req.flash('error', 'Username or Email is already taken.');
      res.redirect('/local_signup');
    } else {
      console.log('successfully registered the user');
      console.log(newUser);
      req.flash('success', 'You are now registered and can login.');
      res.redirect('/local_login');
    }
  });
}

exports.showLocalLogin = (req, res) => {
  res.render('localauth/local_login');
}

exports.loginUser = (req, res) => {
  req.flash('success', 'You are now logged in');
  res.redirect('/guestbook');
}

exports.showAuth0Lock = (req, res) => {
  res.render('auth0', { env: env });
}
