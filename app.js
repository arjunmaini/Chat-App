const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server)
users=[]
connections=[]

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log("Connected: " + connections.length + " sockets connected.");

    //Disconnect
    socket.on('disconnect', function (data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: " + connections.length + " sockets connected.")
    });

    socket.on('send message', function (data) {

        io.sockets.emit('new message', {msg: data, user : socket.username});
    })

    socket.on('new user' ,function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }




})

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

server.listen(3214, function(){
console.info("Server has started on http://localhost:3214/")
})