'use strict';
// load the Cloudant library
var cloudantURL = "https://azincencorrioduchignoody:7d392fbae6755d3aab27bdb441c2b6a1ae879194@38255844-f351-4ae0-9d53-5774023e3cf4-bluemix.cloudant.com"
var Cloudant = require('cloudant'),
  cloudant = Cloudant({
    url: cloudantURL
  }),
  db = cloudant.db.use("users");

// create a document
var createDocument = function(newUser, callback) {
  console.log("Creating document 'mydoc'");
  // we are specifying the id of the document so we can update and delete it later
  db.insert(newUser, function(err, data) {
    console.log("Error:", err);
    console.log("Data:", data);
    callback(err, data);
  });
};

//login
exports.get_user = function(req, res) {
  var username = req.params.username;
  var password = req.params.password;

  //if db contains username, check password
  db.find({
    "selector": {
      "$and": [{
          "username": username
        },
        {
          "password": password
        }
      ]
    }
  }, function(er, result){
      console.log(er);
      console.log(result);
      res.json(result);
  })
}

//
exports.get_match = function(req, res) {
  console.log("WOOTd!")
}
