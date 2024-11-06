const express = require('express');
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log("A user is connected", socket.id);

    socket.on('msg_send', (data) => {
        console.log(data);
        // io.emit('msg_rcvd', data); //everyone will receive the msg
        // socket.emit('msg_rcvd', data); //whichever client sends the msg will receive it other will not receive it
        socket.broadcast.emit('msg_rcvd', data); //except you, everyone will receive the msg
    })
})

app.use('/', express.static(__dirname + '/public'));

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})


