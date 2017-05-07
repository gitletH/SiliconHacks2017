var express = require('express'),
    app = express(),
    port = 3000,
    bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require('./api/routes/routes.js');
routes(app);

app.listen(port);

console.log("working on 3000");
