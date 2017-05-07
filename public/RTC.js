var peer = new Peer({key: 'lwjd5qra8257b9'});
var mediapromise = null;
var streamobj = null;
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
function answer(call) {
  console.log('receiving call')
  mediapromise = navigator.mediaDevices.getUserMedia({audio : true, video : true});
  mediapromise.then(function(stream) {
    stream.getVideoTracks()[0].enabled = !$('#novideo').checked;
    stream.getAudioTracks()[0].enabled = !$('#mute').checked;
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
    call.on('close', function() {
      $('#call').text("call ended")
      $('#call').attr('disabled', 'disabled')
      mediapromise = null
    })
    $('#novideo').change(function(e) {
      stream.getVideoTracks()[0].enabled = !this.checked;
    })
    $('#mute').change(function(e) {
      stream.getAudioTracks()[0].enabled = !this.checked;
    })
  })
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
    stream.getVideoTracks()[0].enabled = !$('#novideo').checked;
    stream.getAudioTracks()[0].enabled = !$('#mute').checked;
    var call = peer.call(peerid, stream);
    $('#call').text('end call')
    call.on('stream', function(remote) {
      display(remote);
    })
    $('body').on('click', '#call', function(e) {
      call.close()
    })
    call.on('close', function() {
      $('#call').text("call ended")
      $('#call').attr('disabled', 'disabled')
      mediapromise = null
    })
    $('#novideo').change(function(e) {
      stream.getVideoTracks()[0].enabled = !this.checked;
    })
    $('#mute').change(function(e) {
      stream.getAudioTracks()[0].enabled = !this.checked;
    })
  })
}
peer.on('call', answer)