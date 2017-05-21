var peer = null;
var mediapromise = null;
var incall = false;
function display(remote) {
  var video = document.querySelector('video');
  video.srcObject = remote;
  video.onloadedmetadata = function(e) {video.play();}
}

function call() {
  var first = true
  if(incall)
  {
    console.log("already in call")
    return;
  }
  console.log("prepare for call")
  mediapromise = navigator.mediaDevices.getUserMedia({audio : true, video : true});
  mediapromise.then(function(stream) {
    stream.getVideoTracks()[0].enabled = !$('#novideo').checked;
    stream.getAudioTracks()[0].enabled = !$('#mute').checked;
    peer = new SimplePeer({ initiator: true, config: { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] }, stream: stream})
    $('#call').attr('disabled', 'disabled')
    $('#call').text("calling...")

    peer.on('signal', function(data) {
      if(first)
      {
        socket.emit('call', data)
        first = false;
      }
      else
      {
        socket.emit('calldata', data)
      }
    })
    socket.on('calldata', function(data){
      peer.signal(data)
    })


    peer.on('connect', function(){
      $('#call').text('end call')
      $('#call').removeAttr('disabled')
      incall = true
    })
    peer.on('error', function(err) {
      console.log(err);
      $('#call').attr('disabled', 'disabled')
      $('#call').text("can't call")
    })


    peer.on('stream', function(remote) {
      display(remote);
    })
    $('body').on('click', '#call', function(e) {
      peer.destroy(true)
    })


    peer.on('close', function() {
      $('#call').text("call ended")
      $('#call').attr('disabled', 'disabled')
      incall = false
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

function answer(data) {
  if(incall)
  {
    console.log("already in call")
    return;
  }
  console.log('receiving call')
  mediapromise = navigator.mediaDevices.getUserMedia({audio : true, video : true});
  mediapromise.then(function(stream) {
    stream.getVideoTracks()[0].enabled = !$('#novideo').checked;
    stream.getAudioTracks()[0].enabled = !$('#mute').checked;
    // Answer the call, providing our MediaStream
    peer = new SimplePeer({initiator: false, config: { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] }, stream: stream})
    $('#call').attr('disabled', 'disabled')
    $('#call').text("answering call...")

    peer.on('signal', function(data) {
      socker.emit('calldata', data)
    })
    socket.on('calldata', function(data){
      //damn ICE people
      if(data.candidate && data.candidate.candidate && data.candidate.candidate.includes("srflx"))
        return;
      //damn ICE people 
      peer.signal(data)
    })


    peer.on('connect', function(){
      $('#call').text('end call')
      $('#call').removeAttr('disabled')
      incall = true
    })
    peer.on('error', function(err) {
      console.log(err);
      $('#call').attr('disabled', 'disabled')
      $('#call').text("can't receive")
    })


    peer.on('stream', function(remote) {
      display(remote);
    })
    $('body').on('click', '#call', function(e) {
      peer.destroy(true)
    })


    peer.on('close', function() {
      $('#call').text("call ended")
      $('#call').attr('disabled', 'disabled')
      incall = false
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