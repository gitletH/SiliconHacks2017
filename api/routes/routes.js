'use strict';
module.exports = function(app) {
  var bigboss = require('../controllers/controller.js');

  //login
  app.route('/user/:username/:password')
     .get(bigboss.get_user)

  //match
  app.route('/match/:user/:peer')
    .get(bigboss.get_match)
}
