'use strict';
module.exports = function(app) {
  var bigboss = require('../controllers/controller.js');
  //CORS middleware
  var allowCrossDomain = function(req, res, next) {
      res.header('Access-Control-Allow-Origin', 'example.com');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');

      next();
  }

  //...
  app.configure(function() {
      app.use(express.bodyParser());
      app.use(express.cookieParser());
      app.use(express.session({ secret: 'cool beans' }));
      app.use(express.methodOverride());
      app.use(allowCrossDomain);
      app.use(app.router);
      app.use(express.static(__dirname + '/public'));
  });
  //login
  app.route('/user/:username/:password')
     .get(bigboss.get_user)

  //match
  app.route('/match/:user/:peer')
    .get(bigboss.get_match)
}
