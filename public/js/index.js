const username = document.getElementById('username');
const loginForm = document.getElementById('login-form');
const socket = io();

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const formEls = e.srcElement;

  // Base64 encoding for data obfuscation
  let usernameValue = formEls[0].value;
  let roomValue = formEls[1].value;

  window.location = `https://www.chatwithcoffee.com/chat.html?${formEls[0].name}=${btoa(usernameValue)}&${formEls[1].name}=${btoa(roomValue)}`
})

function createNewRoom(){
  if (username.value.trim() =='') {
    swal("Please choose a username.")
    username.value = '';
    return;
  }
  chooseRoomName()
  .then(roomName => {
    if (roomName.trim() === '') {
       swal("Please choose a room name.").then(() => createNewRoom())
       return;
    } else {
      window.location = `https://www.chatwithcoffee.com/chat.html?v53r=${btoa(username.value)}&r0o3=${btoa(roomName)}`
    }
  })
}

function chooseRoomName(){
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
