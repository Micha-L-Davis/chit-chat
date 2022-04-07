'use strict'

const { io } = require('socket.io-client');
const socket = io('http://localhost:3000');

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('send', {userID: 'userrrrrr', roomID: '1234', message: input.value} );
        input.value = '';
    }
});

socket.on('send', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
