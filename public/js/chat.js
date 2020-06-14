const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const usersOnline = document.getElementById('users-online');
const socket = io();

// Get username and room from url
let { v53r, r0o3 } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Decode from Base64
// try {
//   v53r = atob(v53r)
//   r0o3 = atob(r0o3)
// } catch(e) {
//
// }
if (v53r && v53r[v53r.length-1] == "=") v53r = atob(v53r);
if (r0o3 && r0o3[r0o3.length-1] == "=") r0o3 = atob(r0o3);

const username = v53r || null;
const room = r0o3 || null;

socket.on('invited', invitedRoom => {
  if (window.location.href.indexOf('invite') == -1) return;
  invitedUserChooseUsername(invitedRoom)
    .then( invitedUserName => {
      const u = invitedUserName;
      // const r = btoa(invitedRoom);
      window.location = `https://my-coffee-chat.herokuapp.com/chat.html?v53r=${u}&r0o3=${invitedRoom}` || `http://localhost:3000/chat.html?v53r=${u}&r0o3=${invitedRoom}`
    })
})

socket.on('regular-join', datam => {
  let { v53r, r0o3 } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });
  username = atob(v53r);
  room = atob(r0o3);
})

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
// socket.on('bing', () => {
//   const bing = document.getElementById('bing-sound');
//   setTimeout(() => {
//     bing.play();
//   }, 100)
// })

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
  // try {
  //   room = atob(room);
  // } catch(e) {
  //   room = room;
  // }
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
  userList.innerHTML = '';
  users.forEach(user => {
    if (user && user[user.length-1] == "=") user = atob(user);
    userList.appendChild(createSanitizedElement('li', user.username, null, null)))
  }
}

// Sanitizing the user's input for error-prone/harmful data
function createSanitizedElement(elType, elText, elId, elClass) {
  var el = document.createElement(elType);
  if (elClass) elClass.forEach(cl => el.classList.add(cl));
  if (elId) el.id = elId;
  if (elText) el.appendChild(document.createTextNode(elText));
  return el;
}

function invitedUserChooseUsername(){
  return swal({
    text: "You've been invited to a CoffeeChat! Please choose a username before joining.",
    content: "input",
    button: {
      text: "Join!",
      closeModal: true,
    }
  })
}

function createdInviteUserLink(){
  return swal(`Share the following URL to invite someone to this chat!\n\nhttps://my-coffee-chat.herokuapp.com/invite?r0o3=${btoa(r0o3)}`)

}
