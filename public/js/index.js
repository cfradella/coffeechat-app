const username = document.getElementById('username');
const loginForm = document.getElementById('login-form');

// loginForm.addEventListener('submit', e => {
//
//   return;
//   // if (e.srcElement[0].value = ''){
//   //
//   // }
//
//   // loginForm.submit();
// })
function newRoom(){
  if (username.value.trim() =='') {
    swal("Please choose a username.")
    username.value = '';
    return;
  }
  chooseRoom()
  .then(roomName => {
    if (!roomName) {
       swal("Please choose a room name.").then(() => newRoom())
       return;
    } else {
      window.location = `http://localhost:3000/chat.html?username=${username.value}&room=${roomName}`
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
