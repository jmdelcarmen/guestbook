'use strict';
const express = require('express');
const router = express.Router();
const Guest = require('../models/guest');
const env = require('../app').env;




router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/addnote', ensureAuthenticated, (req, res) => {
  res.render('addnote', {user: req.user});
});

//////////////////////GUESTBOOK////////////////////////////
router.route('/')
  //Guestlist
  .get(ensureAuthenticated, (req, res) => {
    Guest.find({}, (e, guests) => {
      if (e) throw e;
       res.render('guestbook', {
        guestlist: guests,
        title: "Guestbook",
        env: env,
        user: req.user || null
      });
    });
  })
  //Add guest to guestlist
  .post(ensureAuthenticated, (req, res, next) => {
    let user = req.user;
    let userMessage = req.body.usermessage;
    if (userMessage !== "") {
      var newGuest = new Guest({
        "username": user.nickname || user.username,
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
router.get('/:id', ensureAuthenticated, (req, res) => {
  Guest.findById(req.params.id, (e, guest) => {
    res.render('guest', {
      user: req.user,
      guest: guest
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
    res.redirect('/local_login');
  }
};

module.exports = router;
