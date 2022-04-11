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

  socket.on('join', payload => {
    console.log(payload.roomID);
    socket.join(payload.roomID);
    socket.emit('join', payload.roomID);
    payload.message = `${payload.userID} has joined the room`;
    socket.broadcast.to(payload.roomID).emit('send', payload);
  });

//   socket.on('leaving', payload => {
//     payload.message = `${payload.userID} has left the room`;
//     socket.broadcast.to(payload.roomID).emit('send', payload);
//   });

  socket.on('send', payload => {
    let date = new Date();
    let message = `(${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}) ${payload.roomID} >  ${payload.userID}: ${payload.message}`;
    payload.message = message;
    server.to(payload.roomID).emit('send', payload);
  });

  socket.on('leaving', ()=> {
    payload.message = `${payload.userID} has left the room`;
    socket.broadcast.to(payload.roomID).emit('send', payload);
    delete payload.roomID.userID
  })

});



http.listen(port, () => {
  console.log(`Socket.IO server running on ${port}`);
});
