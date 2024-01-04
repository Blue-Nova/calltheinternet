const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 80;

app.use(express.static('public'));

io.on('connection', (socket) => {
   console.log('User connected:', socket.id);

   // Notify all clients about the new user
   io.emit('user-connected', socket.id);

   // Handle WebRTC signaling
   socket.on('offer', (offer) => {
      io.emit('offer', offer, socket.id);
   });

   socket.on('answer', (answer) => {
      io.emit('answer', answer, socket.id);
   });

   socket.on('ice-candidate', (candidate) => {
      io.emit('ice-candidate', candidate, socket.id);
   });

   socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      // Notify all clients about the disconnected user
      io.emit('user-disconnected', socket.id);
   });
});

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});