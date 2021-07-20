const path = require('path')
const http = require('http')
const express = require("express")
const socketio = require("socket.io")
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser } = require('./utils/users')

const app = express();
const server = http.createServer(app)
const io = socketio(server)


// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'ChatCord Bot'


// RUN WHEN CLIENT CONNECTS
io.on('connection', socket => {
    // console.log("New WS Connection...")

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room)

        socket.join(user.room);
        // logged-in user can see 
        socket.emit('message', formatMessage(botName, 'Welcome to Chatcord'))

        // BROADCAST WHEN A USER CONNECTS
        // everyone but logged-in user can see
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined this chat`));


    })

    // LISTEN FOR CHATMESSAGE
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg))
    })
    // WHEN USER DISCONNECTS
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'))
    })

})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
