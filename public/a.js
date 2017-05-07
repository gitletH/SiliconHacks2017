var peer = new Peer({key: 'lwjd5qra8257b9'});
var mediapromise = null;
peer.on('open', function(id) {
  $('#myid').text('My peer ID is: ' + id);
  $('body').on('click', '#call', function(e) {
    var peerid = $('#peerid').val();
    call(peerid)
  })
})

function display(remote) {
  var video = document.querySelector('video');
  video.srcObject = remote;
  video.onloadedmetadata = function(e) {video.play();}
}
function call(peerid) {
  if(mediapromise !== null)
  {
    console.log("already in call")
    return;
  }  
  console.log("prepare for call")
  mediapromise = navigator.mediaDevices.getUserMedia({audio : true, video : true});
  mediapromise.then(function(stream) {
    var call = peer.call(peerid, stream);
    $('#call').text('end call')
    call.on('stream', function(remote) {
      display(remote);
    })
    $('body').on('click', '#call', function(e) {
      call.close()
    })
    call.on('close', function() {$('#call').text("call ended"); $('#call').attr('disabled', 'disabled'); mediapromise = null;})
  })
}
peer.on('error', function(e) {
  $('#error').text(e.type);
})
peer.on('call', function(call) {
  console.log('receiving call')
  mediapromise = navigator.mediaDevices.getUserMedia({audio : true, video : true});
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
    call.on('close', function() {$('#call').text("call ended"); $('#call').attr('disabled', 'disabled'); mediapromise = null;})
  })
})