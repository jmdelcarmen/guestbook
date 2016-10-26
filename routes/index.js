var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

//Guestlist
router.get('/', function (req, res) {
  var db = req.db;
  var collection = db.get('guests');
  collection.find({}, {}, function (e, docs) {
    res.render('index', {
      guestlist: docs,
      "title": "Guestbook"
    });
  });
});

//Direct to page with guest information
router.get('/:username', function (req, res){
  var username = req.params.username;
  var db = req.db;
  var collection = db.get('guests');
  collection.find({"username": username}, (e, doc) => {
    res.render('search', {
      name: doc[0].username,
      email: doc[0].email,
      message: doc[0].message
    });
  });
});

//Remove guest from guestbook
router.get('/:id/delete/', function (req, res) {
  var id = req.params.id;
  var objectId = new ObjectID(id);
  var db = req.db;
  var collection = db.get('guests');
  collection.remove({"_id": objectId});
  res.redirect('/');
});



//Add guest to guestlist
router.post('/', (req, res) => {
  //Set out internal DB variable
  var db = req.db;
  //Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;
  var userMessage = req.body.usermessage;
  //Set our collection
  var collection = db.get('guests');

  //Submit to the db
  if (userName !== "" && userEmail !== "" && userMessage !== "") {
    collection.insert({
      "username": userName,
      "email": userEmail,
      "message": userMessage,
      "date": new Date().toDateString()
    }, (err, doc) => {
        if (err) {
          //If it failed, return error
          res.send('There was a problem adding the information to the database.');
        }
        else {
          //And forward to success page
          res.redirect('/');
        }
    });
  }
  else {
    res.redirect('/');
  }
});


module.exports = router;
