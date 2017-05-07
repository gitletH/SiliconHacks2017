'use strict';
// load the Cloudant library

var Cloudant = require('cloudant'),
  cloudant = Cloudant({url: "https://azincencorrioduchignoody:7d392fbae6755d3aab27bdb441c2b6a1ae879194@mydomain.cloudant.com"}),
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

var HttpClient = function() {
  this.get = function(aUrl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", aUrl, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  }
}

//login
exports.get_user = function(req, res){
  var username = req.params.username;
  var password = req.params.password;

  var client = new HttpClient();
  //if db contains username, check password

  if()
}

//
exports.get_match = function(req, res){
  console.log("WOOTd!")
}
