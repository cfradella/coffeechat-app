const path = require('path');
const http = require('http');
const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const socketio = require('socket.io');
const isBase64 = require('is-base64');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// 'Keep Alive' for the socket connection
io.set('heartbeat timeout', 4000);
io.set('heartbeat interval', 2000);

const admin = 'admin';

// Force SSL
app.use(sslRedirect());
app.use(express.static(path.join(__dirname, 'public')))

app.get('/invite', (req, res) => {
  const invitedRoom = req.query.r0o3
  res.sendFile('public/chat.html', { root: __dirname });
  io.on('connection', socket => {
    socket.emit('invited', invitedRoom);
  })
})

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    // Join named room
    socket.join(user.room);
    socket.emit('bing', true);

    // Welcome current user
    socket.emit('message', formatMessage(admin, `- You have joined ${room} chat -`, true))

    // When a user connects
    socket.broadcast.to(user.room).emit(
      'message',
      formatMessage(admin, `- ${user.username} has joined the chat -`, true))

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

  // Checking if the username and room are encoded as Base64
  socket.on('isBase64', str => {
    console.log(isBase64(str[0]))
    socket.emit('base64Checked', [isBase64(str[0]), isBase64(str[1])])
  })

  // When a user disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(admin, `- ${user.username} has left the chat -`, true))

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
