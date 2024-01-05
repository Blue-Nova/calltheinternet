const express = require('express');
const http = require('http');
const socketIO = require('socket.io')(http);
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', socket => {
   console.log('A user connected to the voice call room');
 
   // Handle 'join' events
   socket.on('join', () => {
      console.log('A user joined the voice call room');
      socket.broadcast.emit('user-joined', socket.id);
   });
 
   // Handle 'leave' events
   socket.on('leave', () => {
      console.log('A user left the voice call room');
      socket.broadcast.emit('user-left', socket.id);
   });
 
   // Handle 'disconnect' events
   socket.on('disconnect', () => {
      console.log('A user disconnected from the voice call room');
      socket.broadcast.emit('user-disconnected', socket.id);
   });
 });

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname) + '/index.html');
});

server.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});