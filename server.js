const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { Server } = require('http');

const app = express();
const server = Server(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit('participantJoined', socket.id);

    // Handle WebRTC signaling events
    socket.on('offer', (offer, targetUserId) => {
      io.to(targetUserId).emit('offer', offer, socket.id);
    });

    socket.on('answer', (answer, targetUserId) => {
      io.to(targetUserId).emit('answer', answer, socket.id);
    });

    socket.on('iceCandidate', (candidate, targetUserId) => {
      io.to(targetUserId).emit('iceCandidate', candidate, socket.id);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      io.to(roomId).emit('participantDisconnected', socket.id);
    });
  });
});

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});