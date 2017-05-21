var express = require('express'),
    path = require('path'),
    http = require("http"),
    app = express(),
    port = 3000,
    io = require("socket.io")(http), // web socket external module
    bodyParser = require('body-parser');
require('dotenv-safe').load();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require('./api/routes/routes.js');
routes(app);
app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT || port);
console.log("working on " + process.env.PORT);
var counter = 0;
var connections = {};
io.on('connection', function(client){
  console.log(client.id + ' connected');
  client.on('chat', function(data){

  });
  client.on('room', function(data){
    console.log('room ' + counter + ' established')
    client.join(counter)
    connections[client.id] = counter;
    socket.to(data.id).emit('join', {id : client.id, room : counter, lang : data.lang})
    counter += 1
  })
  client.on('join', function(data){
    var roomnum = data.room
    console.log('room ' + roomnum + ' filled')
    client.join(roomnum)
    connections[client.id] = roomnum;
    socket.broadcast.to(roomnum).emit('joined', {id : client.id, lang : data.lang})
  })
  socket.on('disconnect', function(client){
    console.log(client.id + ' disconnected');
    socket.to(connections[client.id]).emit('kill', client.id)
  })
});


