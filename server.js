const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'System';

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
  console.log('new socket connection')

  // Welcome current user
  socket.emit('message', formatMessage(botName, 'Welcome to CoffeeChat!'))

  // When a user connects
  socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat.'))

  // When a user disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat.'))
  })

  // Listen for messages
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('You', msg))
  })
})

const PORT = process.env.PORT || '3000';


server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
