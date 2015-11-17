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

	cleanChat.send = function(username, message, time)
	{
		var cleanChatline = $('<li class="media"><div class="media-body"><div class="media"><div class="media-body" ><h5>'+username+'</h5>'+message+'<br /><small class="text-muted">'+time+'</small><hr/></div></div></div></li>');
		$('#messageBox').append(cleanChatline);
		$('#message').val("");
	}

	cleanChat.welcome = function()
	{
		$('#loginModal').modal('toggle');
		server.cleanChatServer.setUserList();
	}

	cleanChat.setUserList = function(users)
	{
		for(var i = 0; i < users.length; i++)
			$('#usersList').append($('<li data-username="'+users[i]+'" class="media"><div class="media-body"><div class="media"><div class="media-body"><h5><i class="fa fa-user"></i> '+users[i]+'</h5></div></div></div><hr/></li>'));
	}

	cleanChat.removeUser = function(nick)
	{
		$('[data-username="'+nick+'"]').remove();
		$('#messageBox').append($('<li class="media"><div class="media-body"><div class="media"><div class="media-body" ><i class="fa fa-sign-out"></i> '+nick+' has left the chat<br /><small class="text-muted">23rd June at 5:00pm</small><hr/></div></div></div></li>'));
	}

	cleanChat.addUser = function(nick)
	{
		$('#usersList').append($('<li data-username="'+nick+'" class="media"><div class="media-body"><div class="media"><div class="media-body"><h5><i class="fa fa-user"></i> '+nick+'</h5></div></div></div><hr/></li>'));
		$('#messageBox').append($('<li class="media"><div class="media-body"><div class="media"><div class="media-body"><i class="fa fa-sign-in"></i> '+nick+' join the chat<br /><small class="text-muted">23rd June at 5:00pm</small><hr/></div></div></div></li>'));
	}

	$('#loginSubmit').click(function() {
		if (!server)
			return;

		var href = window.location.href;
		var roomId = href.substr(href.lastIndexOf('/') + 1);

		server.cleanChatServer.login( $('#loginUsername').val(), roomId );
	});

	$('#sendMessage').click(function() {
		if (!server)
			return;
		
		server.cleanChatServer.send( $('#message').val() );
	});

});