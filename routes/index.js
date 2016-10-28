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

///////////////////////////////////////////////////////////
////////////////////////HOME PAGE//////////////////////////
///////////////////////////////////////////////////////////
router.route('/').get((req, res) => {
  res.render('index');
}).post((req, res) => {

});



///////////////////////////////////////////////////////////
/////////////////////////LOGIN////////////////////////////
///////////////////////////////////////////////////////////
router.get('/login',
  function(req, res){
    res.render('login', { env: env });
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  });

///////////////////////////////////////////////////////////
//////////////////////GUESTBOOK////////////////////////////
///////////////////////////////////////////////////////////
router.route('/guestbook')
  //Guestlist
  .get((req, res) => {
    var db = req.db;
    var collection = db.get('guests');
    collection.find({}, {}, function (e, docs) {
      res.render('guestbook', {
        guestlist: docs,
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
    var userEmail = req.body.useremail;
    var userMessage = req.body.usermessage;
    //Set our collection
    var collection = db.get('guests');

    //Submit to the db
    if (userEmail !== "" && userMessage !== "") {
      collection.insert({
        "username": req.user.nickname,
        "email": userEmail,
        "message": userMessage,
        "avatar": req.user.picture,
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
////////////////////////////////////////////
////////////Direct to page with guest information
router.get('/guestbook/:username', function (req, res){
  var username = req.params.username;
  var db = req.db;
  var collection = db.get('guests');
  collection.find({"username": username}, (e, doc) => {
    res.render('search', {
      name: doc[0].username,
      email: doc[0].email,
      message: doc[0].message,
      avatar: doc[0].avatar
    });
  });
});
//////////////////////////////////////////////
///////////////////Remove guest from guestbook
router.get('/guestbook/:id/delete/', function (req, res) {
  var id = req.params.id;
  var objectId = new ObjectID(id);
  var db = req.db;
  var collection = db.get('guests');
  collection.remove({"_id": objectId});
  res.redirect('/guestbook');
});

module.exports = router;
