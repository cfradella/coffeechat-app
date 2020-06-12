const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const usersOnline = document.getElementById('users-online')
const socket = io();

// Get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and Users
socket.on('roomUsers', ({ room, users}) => {
  const userCount = Object.keys(users).length;
  usersOnline.innerHTML = `Users Online ( ${userCount} )`
  outputRoomName(room);
  outputUsers(users);
})

// Message from server
socket.on('message', message => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('bing', () => {
  const bing = document.getElementById('bing-sound');
  setTimeout(() => {
    bing.play();
  }, 100)
})

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value.trim();
  if (!msg) return;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// Output message to document
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  if (message.username === 'System'){
    div.innerHTML =  `
    <div class='chat-msg-system'>
      <span>${message.text}</span>
    </div>`;
  } else {
    div.innerHTML =  `
    <div class='chat-msg'>
      <p class="meta">${message.username} <span>- ${message.time}</span></p>
      <p class="text">
        ${message.text}
      </p>
    </div>`;
  }
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
