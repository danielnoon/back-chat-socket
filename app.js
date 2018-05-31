const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/'
});
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.on('connection', socket => {
  socket.on('join', (server, ack) => {
    socket.join("test", err => {
      console.log("A SOCKET JOINED ", server);
      console.log("Socket's rooms: ", socket.rooms);
      debugUser = socket.id;
      ack(true);
    });
  })
});

app.get('/test', function (req, res) {
  res.send('<h1>Hello world</h1>');
});

const port = process.env.PORT || 3030;

http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
