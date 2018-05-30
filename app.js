const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/',
  origins: '*:*'
});
const PubSub = require('@google-cloud/pubsub');

const projectId = 'seminar-205000';
let debugUser = '';

const pubsubClient = new PubSub({
  projectId
});

io.on('connection', socket => {
  socket.on('join', (server, ack) => {
    socket.join(server, err => {
      console.log("A SOCKET JOINED ", server);
      console.log("Socket's rooms: ", socket.rooms);
      debugUser = socket.id;
      ack(true);
    });
  })
});

pubsubClient
  .topic('new-message')
  .subscription('new-message')
  .on('message', data => {
    const message = JSON.parse(data.data.toString());
    console.log("A MESSAGE WAS SENT TO ", message.server);
    console.log(io.sockets.sockets[debugUser].rooms);
    // io.emit('new-message', message);
    io.sockets.to(message.server).emit('new-message', message);
    data.ack();
  });

app.get('/test', function (req, res) {
  res.send('<h1>Hello world</h1>');
});

const port = process.env.PORT || 3030;

http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
