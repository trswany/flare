var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var numConnections = 0;
var numFlares = 0;

app.get('/', function(req, res) {
  res.send('<h1>Hello, world</h1>');
});

io.on('connection', function(socket) {
  console.log('a user connected');
	numConnections++;
	io.emit('numConnections', numConnections);
  socket.on('disconnect', function(){
    console.log('user disconnected');
	if (numConnections > 0) {
		numConnections--;
		io.emit('numConnections', numConnections);
	}
  });
  socket.on('click', function(msg){
    if (typeof msg != "object" || typeof msg[0] != "number" || typeof msg[1] != "number") {
      console.log('invalid message received')
    } else {
      console.log('click at coordinates: ' + msg);
      io.emit('flare', msg);
	numFlares++;
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
