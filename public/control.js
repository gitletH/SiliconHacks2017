var mediapromise = null;
var peer;
var g_id;
var connectedPeers = {};
var lang;
//redirect if not logged in
if(window.localStorage.getItem('_id') === null)
{
  window.location.replace('login.html');
}
// https://github.com/peers/peerjs.git
// Connect to PeerJS, have server assign an ID instead of providing one
// Showing off some of the configs available with PeerJS :).
// Handle a connection object.
function connect(c) {
  // Handle a chat connection.
  if (c.label === 'chat') {
    lang = c.metadata.language;
    console.log(lang);

    var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
    var header = $('<h1></h1>').html('Chat with <strong>' + c.peer + '</strong>');
    var messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
    chatbox.append(header);
    chatbox.append(messages);

    // Select connection handler.
    chatbox.on('click', function() {
      if ($(this).attr('class').indexOf('active') === -1) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });

    $('#connections').append(chatbox);
    // Call a Peer
    $('#call').click(function() {
      call(c.peer)
    })

    c.on('data', function(data) {
      messages.append('<div><span class="peer">' + c.peer + '</span>: <p>' + data +
        '</p>');
      if(window.localStorage.language !== lang)
      {
        $.ajax({
          type: 'POST',
          url: 'https://cit-i-zen.herokuapp.com:443/translate/',
          data:{
          text: data,
          target: window.localStorage.language,
          source: lang
          },
          success: function(data){
            if(data.error)
              data = "Failed to translate"
            console.log(data)
            messages.append('<p>' + data + '</p></div>')
          },
          error: function(err){
            console.log("Failed to translate")
            messages.append('<p>Failed to translate.</p></div>')
          }
        });
      }
    });

    c.on('close', function() {
        alert(c.peer + ' has left the chat.');
        chatbox.remove();
        if ($('.connection').length === 0) {

        }
        delete connectedPeers[c.peer];
    });
  }
  connectedPeers[c.peer] = 1;
}

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
    stream.getVideoTracks()[0].enabled = !$('#novideo').checked;
    stream.getAudioTracks()[0].enabled = !$('#mute').checked;
    $('#call').attr('disabled', 'disabled')
    $('#call').text("calling...")
    var call = peer.call(peerid, stream);
    call.on('err', function(err) {
      console.log(err);
      $('#call').attr('disabled', 'disabled')
      $('#call').text("can't call")
    })
    call.on('stream', function(remote) {
      if($('#call').attr('disabled') == 'disabled')
      {
        $('#call').text('end call')
        $('#call').removeAttr('disabled')
      }
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
    setTimeout(function() {
      if(!call.open)
      {
        $('#call').attr('disabled', 'disabled')
        $('#call').text("didnt pick up")
      }
    }, 10000)

  })
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

$(document).ready(function() {
  // Close a connection.
  $('#close').click(function() {
    eachActiveConnection(function(c) {
      c.close();
    });
  });

  // Send a chat message to all active connections.
  $('#send').submit(function(e) {
    e.preventDefault();
    // For each active connection, send the message.
    var msg = $('#text').val();
    eachActiveConnection(function(c, $c) {
      if (c.label === 'chat')
      {
        c.send(msg);
        $c.find('.messages').append('<div><span class="you">You: </span>' + msg
          + '</div>');
      }
    });
    $('#text').val('');
    $('#text').focus();
  });
  $('#match').click(function(e) {
    findmatch();
  });
  // Goes through each active peer and calls FN on its connections.
  function eachActiveConnection(fn) {
    var actives = $('.active');
    var checkedIds = {};
    actives.each(function() {
      var peerId = $(this).attr('id');

      if (!checkedIds[peerId]) {
        var conns = peer.connections[peerId];
        for (var i = 0, ii = conns.length; i < ii; i += 1) {
          var conn = conns[i];
          fn(conn, $(this));
        }
      }

      checkedIds[peerId] = 1;
    });
  }

});// Document ready




function findmatch()
{
  //output twitter data
  $('#hobbies').append('<p>Analyzing twitter accounts...</p>')
  $.ajax({
    type: 'POST',
    url: 'https://cit-i-zen.herokuapp.com:443/watson/',
    data:{
      twitter : window.localStorage.twitter
    },
    success: function(data){
      console.log(data);
      $('#hobbies').empty()
      if(data.error)
      {
        $('#hobbies').append('<p>Could not retrieve Twitter analytics</p>')
      }
      else
      {
        $('#hobbies').append('<p>Twitter analytics results:</p>')
        for(var s of data)
        {
          $('#hobbies').append('<p>' + s + '</p>')
        }
      }
    },
    error: function(err){
      console.log("connection disrupted");
    }
  });
  peer = new Peer({
  // Set API key for cloud server (you don't need this if you're running your
  // own.
  host: '/',
  port: 9000,
  secure: true,
  // Set highest debug level (log everything!).
  debug: 1,

  // Set a logging function:
  logFunction: function() {
    var copy = Array.prototype.slice.call(arguments).join(' ');
    $('.log').append(copy + '<br>');
  }
});


// Show this peer's ID.
peer.on('open', function(id){
  alert('stuff is obtained');
  g_id = id;
  var usr = window.localStorage.username;
  console.log(usr);
  $.ajax({
    type: 'POST',
    url: 'https://cit-i-zen.herokuapp.com:443/match_text/',
    data:{
      peer: g_id,
      user: usr
    },
    success: function(data){
      console.log(data);
          var requestedPeer = data['peer'];
    if (!connectedPeers[requestedPeer]) {
      // Create 2 connections, one labelled chat and another labelled file.
      var c = peer.connect(requestedPeer, {
        label: 'chat',
        serialization: 'none',
        metadata: {message: 'hi i want to chat with you!',
      language: window.localStorage.language}
      });
      c.on('open', function() {
        connect(c);
      });
      c.on('error', function(err) { alert(err); });
    }
    connectedPeers[requestedPeer] = 1;
  },
  error: function(err){
    alert(err);
  }
  });
});

// Await connections from others
peer.on('connection', connect);
peer.on('call', answer);
peer.on('error', function(err) {
  console.log(err);
})

// Make sure things clean up properly.
window.onunload = window.onbeforeunload = function(e) {
  if (!!peer && !peer.destroyed) {
    peer.destroy();
  }
};

}
