http://peerjs.com/docs/#start

var peer = new Peer({key: 'lwjd5qra8257b9'});

peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
});

peer.on('connection', function(conn) {
  console.log('I got connected');
  conn.on('open', function() {
  // Receive messages
  conn.on('data', function(data) {
    console.log('Received', data);
  });

  // Send messages
  conn.send('Hello!');
  });
});

$('#submit').submit = function (){
  var conn = peer.connect($('#peerid').val());
};
