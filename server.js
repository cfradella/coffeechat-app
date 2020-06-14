const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// const router = express.Router();

const admin = 'admin';

app.use(express.static(path.join(__dirname, 'public')))

app.get('/invite', (req, res) => {
  const invitedRoom = req.query.r0o3
  console.log("Current room: " + invitedRoom);
  res.sendFile('public/chat.html', { root: __dirname });
  io.on('connection', socket => {
    socket.emit('invited', invitedRoom);
  })
})

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    socket.emit('bing', true);

    // Welcome current user
    socket.emit('message', formatMessage(admin, `You have joined ${room} chat.`, true))

    // When a user connects
    socket.broadcast.to(user.room).emit(
      'message',
      formatMessage(admin, `${user.username} has joined the chat.`, true))

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })

  // Listen for chat message
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg, false))
  })

  // When a user disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(admin, `${user.username} has left the chat.`, true))

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }
  })
})

const PORT = process.env.PORT || '3000';

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
