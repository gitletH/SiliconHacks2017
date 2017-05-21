var mediapromise = null;
var socket = io();
var receive;
var connectedPeers = {};
var lang;
//redirect if not logged in
if(window.localStorage.getItem('_id') === null)
{
  window.location.replace('login.html');
}

$(document).ready(function() {
  //open a connection
  $('#connect').click(function(event) {
    console.log('opening connection');
    var usr = window.localStorage.username;
    console.log(usr);
    $.ajax({
      type: 'POST',
      url: 'https://cit-i-zen.herokuapp.com:443/match_text/',
      data:{
        user: usr,
        id: socket.id
      },
      success: function(match){
        console.log('matched with ' + match.id);
        var requested = match.id;
        if (!connectedPeers[requested]) {
          socket.emit('room', {id : requested, lang : window.localStorage.language})
          $('#connect').text('Connection Found')
          $('#connect').attr('disabled', 'disabled')
        }
      },
      error: function(err){ alert(JSON.stringify(err)) }
    });
    
    // Await connections from others
    socket.on('join', function(data) {
      socket.emit('join', {room : data.room, lang : window.localStorage.language})
      $('#connect').text('Connection Found')
      $('#connect').attr('disabled', 'disabled')
      setUpChatBox(data.id, data.lang)
    })
    socket.on('joined', function(data) {
      setUpChatBox(data.id, data.lang)
    })
    
    // Close a connection.
    $('#close').click(function() {
      socket.close();
    });
    // Send a chat message to all active connections.
    $('#send').submit(function(e) {
      e.preventDefault();
      // For each active connection, send the message.
      var msg = $('#text').val();
      eachActiveConnection(function(peerId, $c) {
        socket.emit('chat', {id: socket.id, text: msg})
        $c.find('.messages').append('<div><span class="you">You: </span>' + msg
          + '</div>');
      });
      $('#text').val('');
      $('#text').focus();
    });
    $('.connection').on('click', function() {
      if ($(this).attr('class').indexOf('active') === -1) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
  });
  //Initializes Chatbox
  function setUpChatBox(target, language) {
    lang = language;
    var chatbox = $('#message').addClass('connection').addClass('active').attr('id', target);
    var header = $('<h1></h1>').html('Chat with <strong>' + target + '</strong>');
    var messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
    chatbox.append(header);
    chatbox.append(messages);
    connectedPeers[target] = true;
  }
  // Goes through each active peer and calls FN on its connections.
  function eachActiveConnection(fn) {
    var actives = $('.active');
    var checkedIds = {};
    actives.each(function() {
      var peerId = $(this).attr('id');

      if (!checkedIds[peerId]) {
        var connected = connectedPeers[peerId];
        if(connected)
          fn(peerId, $(this));
      }
      checkedIds[peerId] = true;
    });
  }

  $('#match').click(function(e) {
    findmatch();
  });
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

}

// Show this peer's ID.


socket.on('chat', function(data) {
  messages.append('<div><span class="peer">' + data.id + '</span>: <p>' + data.text +
    '</p>');
  if(window.localStorage.language !== lang)
  {
    $.ajax({
      type: 'POST',
      url: 'https://cit-i-zen.herokuapp.com:443/translate/',
      data:{
      text: data.text,
      target: window.localStorage.language,
      source: lang
      },
      success: function(data){
        if(data.error)
          data = "Failed to translate"
        console.log(data)
        $('.messages').append('<p>' + data + '</p></div>')
      },
      error: function(err){
        console.log("Failed to translate")
        $('.messages').append('<p>Failed to translate.</p></div>')
      }
    });
  }
});

socket.on('kill', function(data) {
    alert(data + ' has left the chat.');
    $('.connection').filter(function(){return $(this).attr('id') === data}).remove();
    connectedPeers[data] = false;
    $('#connect').removeAttr('disabled')
    $('#connect').text('Connect')
});


socket.on('error', function(err) {
  console.log(JSON.stringify(err));
})
// Make sure things clean up properly.
window.onunload = window.onbeforeunload = function(e) {
  if (!!socket) {
    socket.close();
  }
};
