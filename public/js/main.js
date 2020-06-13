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

//window.location = "http://localhost:3000/chat.html"
// Join chatroom
//if (window.location != "http://localhost:3000/chat.html") socket.emit('joinRoom', { username, room });
socket.emit('joinRoom', { username, room });

// Get room and Users
socket.on('roomUsers', ({ room, users}) => {
  const userCount = Object.keys(users).length;
  usersOnline.innerHTML = `<i class="fas fa-users"></i> Users Online ( ${userCount} )`
  outputRoomName(room);
  outputUsers(users);
})

// Message from server
socket.on('message', message => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Bing sound on log in
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

  if (message.isAdmin){
    div.innerHTML =  `
    <div class='chat-msg-system'>
      <span>${message.text}</span>
    </div>`;
  } else {
    // Sanitizing the user's string input of malicious data
    const metaUser = `${message.username}`
    const metaTime = ` - ${message.time}`
    const msg = `${message.text}`
    const divContainer = createSanitizedElement('div', null, null, ['chat-msg']);

    divContainer.append(
      createSanitizedElement('span', metaUser, null, ['meta']),
      createSanitizedElement('span', metaTime, null, ['timestamp']),
      createSanitizedElement('p', msg, null, ['text'])
    )

    div.appendChild(divContainer);
  }
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
  userList.innerHTML = '';
  users.forEach(user => userList.appendChild(createSanitizedElement('li', user.username, null, null)))
}

// Sanitizing the user's input for error-prone/harmful data
function createSanitizedElement(elType, elText, elId, elClass) {
  var el = document.createElement(elType);
  if (elClass) elClass.forEach(cl => el.classList.add(cl));
  if (elId) el.id = elId;
  if (elText) el.appendChild(document.createTextNode(elText));
  return el;
}
