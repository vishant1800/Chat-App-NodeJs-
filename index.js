const express = require('express');
const http = require('http')
const socketio = require('socket.io')
const connect = require('./config/database-config')
//const ejs = require('ejs')

const Chat = require('./models/chat')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000;

io.on('connection', (socket) => {
    console.log("A user is connected", socket.id);

    socket.on('join_room', (data) => {
        socket.join(data.roomid);
    })

    socket.on('msg_send', async (data) => {
        console.log(data);
        const chat = await Chat.create({
            roomId: data.roomid,
            user: data.username,
            content: data.msg
        })
        io.to(data.roomid).emit('msg_rcvd', data); //everyone will receive the msg
        // socket.emit('msg_rcvd', data); //whichever client sends the msg will receive it other will not receive it
        //socket.broadcast.emit('msg_rcvd', data); //except you, everyone will receive the msg
    })

    socket.on('typing', (data) => {
        socket.broadcast.to(data.roomid).emit('someone_typing')
    })
})

app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

app.get('/chat/:roomid', async (req, res) => {
    const chats = await Chat.find({
        roomId: req.params.roomid
    }).select('content user');
    //console.log(chats);
    res.render('index', {
        //name: 'Vishant',
        id: req.params.roomid,
        chats: chats
    });
})

server.listen(PORT, async () => {
    console.log(`Server started at port ${PORT}`);
    await connect();
    console.log("mongodb connected");
})