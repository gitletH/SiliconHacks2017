var express = require('express'),
    app = express(),
    path = require('path'),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    port = 3000,
    bodyParser = require('body-parser');
require('dotenv-safe').load();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require('./api/routes/routes.js');
routes(app);
app.use(express.static(__dirname + '/public'));
server.listen(process.env.PORT || port);

console.log("working on " + process.env.PORT);
var counter = 0;
var connections = {};
io.on('connection', function(client){
  console.log(client.id + ' connected');
  client.on('chat', function(data){
    console.log(data)
    client.broadcast.to(connections[client.id]).emit(data)
  });
  client.on('room', function(data){
    console.log('room ' + counter + ' established')
    client.join(counter)
    connections[client.id] = counter;
    client.to(data.id).emit('join', {id : client.id, room : counter, lang : data.lang})
    counter += 1
  })
  client.on('join', function(data){
    var roomnum = data.room
    console.log('room ' + roomnum + ' filled')
    client.join(roomnum)
    connections[client.id] = roomnum;
    client.broadcast.to(roomnum).emit('joined', {id : client.id, lang : data.lang})
  })
  client.on('disconnect', function(){
    console.log(client.id + ' disconnected');
    client.broadcast.to(connections[client.id]).emit('kill', client.id)
  })
});


