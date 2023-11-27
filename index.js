import express from 'express';
import { createServer } from 'http';
const app = express();
app.listen(8000, (req, res) => {
    console.log("Server Connected");
});
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.send('./index');
});
const server = createServer(app);
import { Server, Socket } from 'socket.io'; 
const io = new Server(server);
const users = {};
io.on('connection', socket => {
    socket.on('user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('new-user-joined', name);
    });
    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] })
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    });

});