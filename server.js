const path = require('path')
const http = require('http')
const express = require("express")
const socketio = require("socket.io")

const app = express();


const server = http.createServer(app)

const io = socketio(server)

// SET STATIC FOLDER

app.use(express.static(path.join(__dirname, 'public')))

// RUN WHEN CLIENT CONNECTS
io.on('connection', socket => {
    console.log("New WS Connection...")
    // logged-in user can see 
    socket.emit('message', 'Welcome to Chatcord')

    // BROADCAST WHEN A USER CONNECTS
    // everyone but logged-in user can see
    socket.broadcast.emit('message', 'A user has joined this chat');

    // WHEN USER DISCONNECTS
    socket.on('disconnect', () => {
        io.emit('message', 'a user has left the chat')
    })

    // LISTEN FOR CHATMESSAGE
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg)
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
