'use strict';

const { Server } = require ('socket.io');
const PORT = process.env.PORT || 3000;
const server = new Server(PORT);

server.on('connection', socket => {
  console.log('Socket connected' + socket.id);

  socket.on('join', roomID => {
    socket.join(roomID);
    socket.emit('join', roomID);
  });
  socket.on('send', payload => {
    //Format message, username, date, etc.
    let message = `${new Date()}: ${payload.userID}: ${payload.message}`;
    payload.message = message;
    server.emit('send', payload);
  });
  socket.onAny((event, payload) => {
    console.log(event, payload);
  });
});