// access the form 

const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')


// show message on client side
const socket = io();

// MESSAGE FROM SERVER
socket.on('message', message => {
    console.log(message)
    outputMessage(message)

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight

})




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
    div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}