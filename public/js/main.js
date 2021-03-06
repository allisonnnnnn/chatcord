// access the form 
const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.querySelector('#room-name')
const userList = document.querySelector('#users')


// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// show message on client side
const socket = io();

// send url key info to server side
socket.emit('joinRoom', { username, room })

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUser(users);
})

// MESSAGE FROM SERVER
socket.on('message', message => {
    console.log(message)
    outputMessage(message)

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight

})

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add user to DOM
function outputUser(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `

}


// MESSAGE SUBMIT TO SERVER
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // GET MESSAGE INPUT by its id #msg
    const msg = e.target.elements.msg.value

    // emit message to server
    socket.emit('chatMessage', msg)

    // clear input after emit to server
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()


})

// OUTPUT MESSAGE TO DOM
function outputMessage(message) {

    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}