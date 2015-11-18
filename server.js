var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app)
  , path = require('path');
//global.jQuery = require('jquery');
//require('bootstrap');

app.use(express.static(__dirname));

var connections = {};
var rooms = {};

var Eureca = require('eureca.io');
var eurecaServer = new Eureca.Server({allow:['cleanChat.welcome', 'cleanChat.send', 'cleanChat.setUserList', 'cleanChat.removeUser', 'cleanChat.addUser']});

eurecaServer.attach(server);

app.get('/', function (req, res, next) {
	res.sendFile(path.join(__dirname, 'index.html'));
}); 

app.get('/chat/:chatId', function (req, res, next) {
	//console.log(req.params.chatId);
	res.sendFile(path.join(__dirname, 'chat.html'));
}); 


eurecaServer.onConnect(function (connection) {
    //console.log('New client ', connection.id, connection.eureca.remoteAddress);
	connections[connection.id] = {nick:null, room:null, color:null, client:eurecaServer.getClient(connection.id)};
});

eurecaServer.onDisconnect(function (connection) { 
    //console.log('Client quit', connection.id);
	cleanChatServer.removeUser(connections[connection.id].nick, connections[connection.id].room, connections[connection.id].color);
	delete connections[connection.id];
});

var cleanChatServer = eurecaServer.exports.cleanChatServer = {};

cleanChatServer.login = function (nick, roomId) {
	//console.log('Client %s auth with %s', this.connection.id, nick);
	var id = this.connection.id;
	if (nick)
	{
		connections[id].nick = nick;
		connections[id].room = roomId;
		connections[id].color = Colors.random();
		connections[id].client.cleanChat.welcome();
	}

	cleanChatServer.addUser(connections[id].nick, connections[id].room, connections[id].color);
}

cleanChatServer.send = function (message) {
	var sender = connections[this.connection.id];
	for (var c in connections)
	{
		if (sender.room == connections[c].room)
			connections[c].client.cleanChat.send(sender.nick, message, getFormattedDate(), sender.color);
	}
}

cleanChatServer.setUserList = function(){
	var users = [];
	for (var c in connections)
	{
		if (connections[c].nick && connections[c].nick != connections[this.connection.id].nick && connections[c].room == connections[this.connection.id].room)
			users.push({ nick: connections[c].nick, color: connections[c].color });
	}

	connections[this.connection.id].client.cleanChat.setUserList(users);

}

cleanChatServer.removeUser = function(nick, room, color){

	if(!nick)
		return;

	for (var c in connections){
		if (room == connections[c].room)
			connections[c].client.cleanChat.removeUser(nick, getFormattedDate(), color);
	}

}

cleanChatServer.addUser = function(nick, room, color){

	if(!nick)
		return;

	for (var c in connections){
		if (room == connections[c].room)
			connections[c].client.cleanChat.addUser(nick, getFormattedDate(), color);
	}

}

server.listen(8000);

function getFormattedDate() {
    var date = new Date()
    	, dd = date.getDate()
    	, mm = date.getMonth()+1
    	, hours = date.getHours()
    	, minutes = date.getMinutes()
    	, seconds = date.getSeconds();

    if(dd<10)
        dd='0'+dd;

    if(mm<10)
        mm='0'+mm;

    if(hours<10)
        hours='0'+hours;

    if(minutes<10)
        minutes='0'+minutes;

    if(seconds<10)
        seconds='0'+seconds;

    return date.getFullYear() + "-" + mm + "-" + dd + " " +  hours + ":" + minutes + ":" + seconds;
}

Colors = {};
Colors.names = {
    black: "#000000",
    blue: "#0000ff",
    brown: "#a52a2a",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    lightblue: "#add8e6",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    violet: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0"
};

Colors.random = function() {
    var result;
    var count = 0;
    for (var prop in this.names)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
};