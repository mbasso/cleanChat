$(document).ready(function(){

	$('#loginModal').modal({
	  backdrop: 'static',
	  keyboard: false
	});
	$('#loginModal').modal('show');

	var client = new Eureca.Client();
	var server;
	client.ready(function (proxy) {
		server = proxy;
	});
			
	var cleanChat = client.exports.cleanChat = {};

	cleanChat.send = function(username, message, time, color)
	{
		if(!isWindowVisible())
	        audio.play();

		var cleanChatline = $('<li class="media"><div class="media-body"><div class="media"><div class="media-body" ><h5 class="no-margin" style="color: '+color+'">'+username+'</h5>'+message+'<br /><small class="text-muted">'+time+'</small><hr/></div></div></div></li>');
		$('#messageBox').append(cleanChatline);
		$('#messageBox').scrollTop($('#messageBox')[0].scrollHeight);
	}

	cleanChat.welcome = function()
	{
		$('#loginModal').modal('toggle');
		server.cleanChatServer.setUserList();
	}

	cleanChat.setUserList = function(users)
	{
		for(var i = 0; i < users.length; i++)
			addUser(users[i].nick, users[i].color);
	}

	cleanChat.removeUser = function(nick, time, color)
	{
		$('[data-username="'+nick+'"]').remove();
		addMessage(nick, color, time, true);
	}

	cleanChat.addUser = function(nick, time, color)
	{
		addUser(nick, color);
		addMessage(nick, color, time);
	}

	$('#loginForm').submit(function(e) {
		if (!server)
			return;

		var href = window.location.href;
		var roomId = href.substr(href.lastIndexOf('/') + 1);

		server.cleanChatServer.login( $('<div/>').text( $('#loginUsername').val() ).html(), roomId );

    	e.preventDefault();
	});

	$('#messageForm').submit(function(e) {
		if (!server)
			return;
		
		server.cleanChatServer.send( $('<div/>').text( $('#message').val() ).html() );
		$('#message').val("");
		
    	e.preventDefault();
	});

	$('#share').click(function() {
		$('#inviteModal').modal('toggle');
	});

	var addUser = function(nick, color){
		$('#usersList').append($('<li data-username="'+nick+'" class="media"><div class="media-body"><div class="media"><div class="media-body"><h5 style="color: '+color+'"><i class="fa fa-user"></i> '+nick+'</h5></div></div></div><hr/></li>'));
	}

	var addMessage = function(nick, color, time, isRemove){
		var type;
		if(isRemove)
			type = "left";
		else
			type = "join";
		$('#messageBox').append($('<li class="media"><div class="media-body"><div class="media"><div class="media-body"><i class="fa fa-sign-in"></i><b style="color: '+color+'"> '+nick+'</b> '+type+' the chat<br /><small class="text-muted">'+time+'</small><hr/></div></div></div></li>'));
	}

	var isWindowVisible = (function(){
	    var stateKey, eventKey, keys = {
	        hidden: "visibilitychange",
	        webkitHidden: "webkitvisibilitychange",
	        mozHidden: "mozvisibilitychange",
	        msHidden: "msvisibilitychange"
	    };
	    for (stateKey in keys) {
	        if (stateKey in document) {
	            eventKey = keys[stateKey];
	            break;
	        }
	    }
	    return function(c) {
	        if (c) document.addEventListener(eventKey, c);
	        return !document[stateKey];
	    }
	})();

	var audio = document.createElement('audio');
	audio.setAttribute('src', '/notification.mp3');


});