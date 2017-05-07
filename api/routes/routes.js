'use strict';
module.exports = function(app) {
  var bigboss = require('../controllers/controller.js');
  
  //login
  app.route('/user/:username/:password')
     .get(bigboss.get_user)

  //match
  app.route('/match')
    .post(bigboss.get_match)
}
