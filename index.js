const app = require('express')();
const http = require('http').Server(app);
const server = require('socket.io')(http);
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.on('connection', socket => {
  console.log('Socket connected' + socket.id);

  socket.onAny((event, payload) => {
    console.log(event, payload);
  });

  socket.on('join', roomID => {
    console.log(roomID);
    socket.join(roomID);
    socket.emit('join', roomID);
  });
  socket.on('send', payload => {
    //Format message, username, date, etc.
    let date = new Date();
    let message = `(${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}) ${payload.userID}: ${payload.message}`;
    payload.message = message;
    server.to(payload.roomID).emit('send', payload);
  });

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
