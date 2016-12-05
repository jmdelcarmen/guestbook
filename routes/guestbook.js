'use strict';

const env = require('./auth_config').env;
const Guest = require('../models/guest');

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

exports.showAddNote = (req, res) => {
  res.render('addnote', {user: req.user});
}

exports.showGuestbook = (req, res) => {
  // Guest.find({}, (e, guests) => {
  //   if (e) throw e;
  //    res.render('guestbook', {
  //     guestlist: guests,
  //     title: "Guestbook",
  //     env: env,
  //     user: req.user || null
  //   });
  // });

  res.render('guestbook', {user: req.user});
}

exports.addNote = (req, res) => {
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
    });
  }
  else {
    res.redirect('/guestbook');
  }
  res.redirect('/guestbook');
}

exports.showGuestNote = (req, res) => {
  Guest.findById(req.params.id, (e, guest) => {
    res.render('guest_note', {
      user: req.user,
      guest: guest
    });
  });
}

exports.removeNote = (req, res) => {
  let id = req.params.id;
  Guest.findByIdAndRemove(id, (e, data) => {
    if(e){
      throw e;
    }
    console.log('Message successfully deleted.');
  });
  res.redirect('/guestbook');
}

exports.showNotes = (req, res) => {
  Guest.find({}, (err, notes) => {
    res.status(200);
    res.json({notes: notes, user: req.user});
    res.end();
  });
}
