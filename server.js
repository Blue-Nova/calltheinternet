const express = require('express');
const socketIO = require('socket.io');
const { Server } = require('http');

const app = express();
const server = Server(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room when requested by the client
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  // Handle WebRTC signaling events
  socket.on('offer', (offer, targetUserId, roomId) => {
    io.to(targetUserId).emit('offer', offer, socket.id, roomId);
  });

  socket.on('answer', (answer, targetUserId, roomId) => {
    io.to(targetUserId).emit('answer', answer, socket.id, roomId);
  });

  socket.on('iceCandidate', (candidate, targetUserId, roomId) => {
    io.to(targetUserId).emit('iceCandidate', candidate, socket.id, roomId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});