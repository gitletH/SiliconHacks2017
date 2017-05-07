var peer = new Peer({key: 'lwjd5qra8257b9'});
var mediapromise = null;
peer.on('open', function(id) {
  $('#myid').text('My peer ID is: ' + id);
  $('body').on('click', '#call', function(e) {
    var peerid = $('#peerid').val()
    call(peerid)
  })
  $('body').on('click', '#send', function(e) {
    $('#send').attr("disabled", "disabled")
    $('#send').text('connecting...')
    var peerid = $('#peerid').val()
    peer.connect(peerid, {metadata : 0})
  })
})

peer.on('connection', function(conn) {
  //receiver
  if(conn.options.metadata === 0)
  {
    $('#send').attr("disabled", "disabled")
    $('#send').text('connecting back...')
    var peerid = conn.peer;
    peer.connect(peerid, {metadata : 1})
  }
  //initiator
  else if(conn.options.metadata === 1)
  {
    conn.send({twoway : true})
    $('#send').text('send message')
    $('#send').removeAttr("disabled")
  }
  conn.on('open', function() {
    // Receive messages
    conn.on('data', function(data) {
      if(data.twoway)
      {
        $('#send').text('send message')
        $('#send').removeAttr("disabled")
      }
      else if(data.message)
      {
        $('#responses').append('<p>' + data + '</p>')
        conn.send({success : true})
      }
      else if(data.success)
      {
        $('#send').text('send message')
        $('#send').removeAttr("disabled")
      }
    })
    // Send messages
  })
  $('body').on('click', '#send', function(e) {
    if($('#message').val() !== '')
    {
      $('#send').text('on its way...')
      $('#send').attr("disabled", "disabled")        
      conn.send({message : $('#message').val()})
    }
    $('#message').val('')
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
    call.on('close', function() {$('#call').text("call ended")})
  })
}
peer.on('error', function(e) {
  console.log(e.type);
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
    call.on('close', function() {$('#call').text("call ended")})
  })
})