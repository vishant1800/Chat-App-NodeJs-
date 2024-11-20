var socket = io();

let btn = document.getElementById('btn');
let InputMsg = document.getElementById('newmsg');
let msgList = document.getElementById('msglist');

btn.onclick = function exec() {
    socket.emit('msg_send', {
        msg: InputMsg.value
    })

}

// listener
socket.on('msg_rcvd', (data) => {
    //console.log(data);
    let listMsg = document.createElement('li');
    listMsg.innerText = data.msg;
    msgList.appendChild(listMsg);
})