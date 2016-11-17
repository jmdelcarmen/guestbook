'use strict';
const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();


const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

///////////////////////////////////////////////////////////
////////////////////////HOME PAGE//////////////////////////
///////////////////////////////////////////////////////////
router.route('/').get((req, res) => {
  res.render('index');
}).post((req, res) => {
//Home page post///
});

///////////////////////////////////////////////////////////
/////////////////////////LOGIN/////////////////////////////
///////////////////////////////////////////////////////////
router.get('/login', (req, res) => {
    res.render('login', { env: env });
  });

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/guestbook');
  });


module.exports = router;
