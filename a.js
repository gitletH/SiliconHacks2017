var peer = new Peer({key: 'lwjd5qra8257b9'});
var conn = peer.connect($('#peerid').val());

peer.on('open', function(id) {
  $('#myid').text('My peer ID is: ' + id);

});

peer.on('connection', function(conn) {
  console.log('I got connected');
  conn.on('open', function() {
    // Receive messages
    conn.on('data', function(data) {
      console.log('Received', data);
    });

    // Send messages

    //Start Call
    call()
  });
});




function display(remote) {
  var video = document.querySelector('video');
  video.srcObject = remote;
  video.onloadedmetadata = function(e) {video.play();}
}
function call() {
  console.log("prepare for call")
  var mediapromise = navigator.mediaDevices.getUserMedia({audio : true, video :true});
  mediapromise.then(function(stream) {
    var peerid = $('#peerid').val()
    var call = peer.call(peerid, stream);
    $('#call').text('end call')
    call.on('stream', function(remote) {
      display(remote);
    })
    $('body').on('click', '#call', function(e) {
      call.close()
    })
    call.on('close', function() {$('#call').text("call ended")})
  })
}
peer.on('error', function(e) {
  console.log(e.type);
})
peer.on('call', function(call) {
  var mediapromise = navigator.mediaDevices.getUserMedia({audio : true, video : true});
  mediapromise.then(function(stream) {
    // Answer the call, providing our MediaStream
    call.answer(stream);
    $('#call').text('end call');
    call.on('stream', function(remote) {
    // `stream` is the MediaStream of the remote peer.
    // Here you'd add it to an HTML video/canvas element.
      display(remote);
    })
    $('body').on('click', '#call', function(e) {
      call.close()
    })
    call.on('close', function() {$('#call').text("call ended")})
  })
})