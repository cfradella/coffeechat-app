const username = document.getElementById('username');
const loginForm = document.getElementById('login-form');
const socket = io();

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const formEls = e.srcElement;

  // Base64 encoding for data obfuscation
  let usernameValue = formEls[0].value;
  let roomValue = formEls[1].value;
  // usernameValue = btoa(usernameValue);
  // roomValue = btoa(roomValue);

  // socket.emit('regular-join', [usernameValue, roomValue]);
  window.location = `https://my-coffee-chat.herokuapp.com/chat.html?${formEls[0].name}=${btoa(usernameValue)}&${formEls[1].name}=${btoa(roomValue)}` || `http://localhost:3000/chat.html?${formEls[0].name}=${btoa(usernameValue)}&${formEls[1].name}=${btoa(roomValue)}`
})

// On invited url
// socket.on('invited', () => {
//   invitedUserChooseUsername()
//     .then( invitedUserName => {
//       const u = btoa(invitedUserName);
//       const r = btoa('room');
//       window.location = `http://localhost:3000/chat.html?v53r=${u}&r0o3=${r}`
//     })
// })

function newRoom(){
  if (username.value.trim() =='') {
    swal("Please choose a username.")
    username.value = '';
    return;
  }
  chooseRoom()
  .then(roomName => {
    if (roomName.trim() === '') {
       swal("Please choose a room name.").then(() => newRoom())
       return;
    } else {
      window.location = `https://my-coffee-chat.herokuapp.com/chat.html?v53r=${username.value}&r0o3=${roomName}` || `http://localhost:3000/chat.html?v53r=${username.value}&r0o3=${roomName}`
    }
  })
}

function chooseRoom(){
  return swal({
    text: 'What room would you like to join?',
    content: "input",
    button: {
      text: "Join!",
      closeModal: true,
    }
  })
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
