const express = require('express');
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log("A user is connected", socket.id);

    socket.on('from_client', () => {
        console.log('Event coming from client');
    })
    setInterval(() => {
        socket.emit('from_server');
    }, 2000);
})

app.use('/', express.static(__dirname + '/public'));

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})


