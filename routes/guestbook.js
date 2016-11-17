'use strict';
const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
const mongoose = require('mongoose');
const Guest = require('../models/guest');


const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

///////////////////////////////////////////////////////////
//////////////////////GUESTBOOK////////////////////////////
///////////////////////////////////////////////////////////
router.route('/')
  //Guestlist
  .get(ensureLoggedIn, (req, res) => {
    Guest.find({}, (e, guests) => {
      res.render('guestbook', {
        guestlist: guests,
        title: "Guestbook",
        env: env
      });
    });
  })
  //Add guest to guestlist
  .post(ensureLoggedIn, (req, res, next) => {
    let user = req.user;
    let userEmail = req.body.useremail;
    let userMessage = req.body.usermessage;

    //Submit to the db
    if (userEmail !== "" && userMessage !== "") {
      var newGuest = new Guest({
        "username": user.nickname,
        "email": userEmail,
        "message": userMessage,
        "avatar": user.picture,
        "date": new Date().toDateString()
      });

      newGuest.save((e, data) => {
        if(e) throw e;
        console.log('New message added');
      });
    }
    else {
      res.redirect('/guestbook');
    }
    res.redirect('/guestbook');
});

/////////////////////////////////////////////////
////////////Direct to page with guest information
router.get('/:username', (req, res) => {
  let username = req.params.username;
  Guest.findOne({"username": username}, (e, guest) => {
    res.render('guest', {
      name: guest.username,
      email: guest.email,
      message: guest.message,
      avatar: guest.avatar
    });
  });
});
//////////////////////////////////////////////
///////////////////Remove guest from guestbook
router.get('/:id/delete/', (req, res) => {
  let id = req.params.id;
  Guest.findByIdAndRemove(id, (e, data) => {
    if(e){
      throw e;
    }
    console.log('Message successfully deleted.');
  });
  res.redirect('/guestbook');
});

module.exports = router;
