'use strict';
var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();


var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

///////////////////////////////////////////////////////////
//////////////////////GUESTBOOK////////////////////////////
///////////////////////////////////////////////////////////
router.route('/')
  //Guestlist
  .get(ensureLoggedIn, (req, res) => {
    var db = req.db;
    var collection = db.get('guests');
    collection.find({}, {}, function (e, records) {
      res.render('guestbook', {
        guestlist: records,
        "title": "Guestbook",
        env: env
      });
    });
  })
  //Add guest to guestlist
  .post(ensureLoggedIn, (req, res) => {
    //Set out internal DB variable
    var db = req.db;
    //Get our form values. These rely on the "name" attributes
    var user = req.user;
    var userEmail = req.body.useremail;
    var userMessage = req.body.usermessage;

    //Set our collection
    var collection = db.get('guests');

    //Submit to the db
    if (userEmail !== "" && userMessage !== "") {
      collection.insert({
        "username": user.nickname,
        "email": userEmail,
        "message": userMessage,
        "avatar": user.picture,
        "date": new Date().toDateString()
      }, (err, doc) => {
          if (err) {
            //If it failed, return error
            res.send('There was a problem adding the information to the database.');
          }
          else {
            //And forward to success page
            res.redirect('/guestbook');
          }
      });
    }
    else {
      res.redirect('/guestbook');
    }
});
/////////////////////////////////////////////////
////////////Direct to page with guest information
router.get('/:username', function (req, res){
  var username = req.params.username;
  var db = req.db;
  var collection = db.get('guests');
  collection.findOne({"username": username}, (e, guest) => {
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
router.get('/:id/delete/', function (req, res) {
  var id = req.params.id;
  var objectId = new ObjectID(id);
  var db = req.db;
  var collection = db.get('guests');
  collection.remove({"_id": objectId});
  res.redirect('/guestbook');
});

module.exports = router;
