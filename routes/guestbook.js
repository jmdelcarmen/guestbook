'use strict';
const express = require('express');
const router = express.Router();
const Guest = require('../models/guest');
const env = require('../app').env;

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//////////////////////GUESTBOOK////////////////////////////
router.route('/')
  //Guestlist
  .get(ensureAuthenticated, (req, res) => {
    Guest.find({}, (e, guests) => {
      res.render('guestbook', {
        guestlist: guests,
        title: "Guestbook",
        env: env
      });
    });
  })
  //Add guest to guestlist
  .post(ensureAuthenticated, (req, res, next) => {
    let user = req.user;
    let userEmail = req.body.useremail;
    let userMessage = req.body.usermessage;
    if (userEmail !== "" && userMessage !== "") {
      var newGuest = new Guest({
        "username": user.nickname || user.username,
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

/////////////Redirect to page with guest information/////////
router.get('/:username', ensureAuthenticated, (req, res) => {
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

////////////////REMOVE GUEST MESSAGE//////////////////
router.get('/:id/delete/', ensureAuthenticated, (req, res) => {
  let id = req.params.id;
  Guest.findByIdAndRemove(id, (e, data) => {
    if(e){
      throw e;
    }
    console.log('Message successfully deleted.');
  });
  res.redirect('/guestbook');
});


function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
};

module.exports = router;
