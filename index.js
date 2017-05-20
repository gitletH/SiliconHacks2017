var express = require('express'),
    path = require('path');
    app = express(),
    port = 3000,
    bodyParser = require('body-parser');
require('dotenv-safe').load();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require('./api/routes/routes.js');
routes(app);
app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT || port);

var PeerServer = require('peer').PeerServer;
var server = PeerServer({
  port: 9000,
  ssl: {
    key: fs.readFileSync('/peerssl/key/here.key'),
    cert: fs.readFileSync('/peerssl/certificate/here.crt')
  }
});

console.log("working on " + process.env.PORT);
