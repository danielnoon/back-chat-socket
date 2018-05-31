const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/'
});
// const redis = require('redis');
// const client = redis.createClient({
//   host: "redis.back-chat.com",
//   port: "6379",
//   password: "fCYJk6g1T7VU"
// });
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({
  host: "redis.back-chat.com",
  port: "6379",
  password: "fCYJk6g1T7VU"
}));

io.on('connection', socket => {
  socket.on('join', (server, ack) => {
    socket.join(server, err => {
      console.log("A SOCKET JOINED ", server);
      console.log("Socket's rooms: ", socket.rooms);
      ack(true);
    });
  });

  socket.on('debug', ack => {
    console.log("DEBUG");
    console.log("Socket's rooms: ", socket.rooms);
    ack(socket.rooms);
  })
});

app.get('/test', function (req, res) {
  res.send('<h1>Hello world</h1>');
});

const port = process.env.PORT || 3030;

http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
